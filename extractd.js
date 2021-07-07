const fs = require('fs');
const path = require('path');
const temp = require('temp-dir');
const Readable = require('stream').Readable;
const Base64Encode = require('base64-stream').Base64Encode;
const shortid = require('shortid');
const ExifTool = require('exiftool-vendored').ExifTool;

const stat = fs.promises.lstat;
const read = fs.promises.readFile;
const remove = fs.promises.unlink;

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_@');

const master = {
    exiftool: null,
    persist: false
};

const exiftoolArgs = ['-E', '-stay_open', 'True', '-@', '-'];

const previews = [
    'JpgFromRaw',
    'PreviewImage'
];

const orientations = [
    'Horizontal (normal)',
    'Mirror horizontal',
    'Rotate 180',
    'Mirror vertical',
    'Mirror horizontal and rotate 270 CW',
    'Rotate 90 CW',
    'Mirror horizontal and rotate 90 CW',
    'Rotate 270 CW'
];

const outcome = (promise) => {
    return promise
        .then(result => ({
            success: true,
            result
        }))
        .catch(error => ({
            success: false,
            error
        }));
};

function streamWipe(file, base64 = false, datauri = false) {
    const item = !base64 ? fs.createReadStream(file) : fs.createReadStream(file).pipe(new Base64Encode((!datauri ? {} : {
        prefix: 'data:image/jpeg;base64,'
    })));

    if (base64) {
        item.path = file;
    }

    item.on('end', async () => {
        await outcome(remove(file));
    });

    return item;
}

async function baseCheck(file, base64 = false, datauri = false) {
    if (!base64) {
        return file;
    }

    const content = await read(file, 'base64');
    await outcome(remove(file));

    return (!datauri) ? content : 'data:image/jpeg;base64,' + content;

}

function bufferToStream(data) {
    const stream = new Readable();
    stream.push(data);
    stream.push(null);
    return stream;
}

async function exists(source) {

    const file = await outcome(stat(source));

    if (file.success && file.result.isFile()) {
        return true;
    }

    if (file.success && !file.result.isFile()) {
        return false;
    }

    if (!file.success && file.error.code === 'ENOENT') {
        return false;
    }
}

function status() {
    return {
        persistent: master.persist
    };
}

async function desist() {
    if (master.exiftool && master.persist) {
        await master.exiftool.end();
        master.exiftool = null;
        master.persist = false;
    }
    return status();
}

function result(source, list) {

    if (!list.length) {
        return {
            error: 'No preview detected',
            source
        };
    }

    const item = list.shift();

    if (!item) {
        return result(source, list);
    }

    if (item instanceof Error) {

        let error = item;

        if (error.message && error.message.includes(' - ')) {
            error = error.message.split(' - ').shift();
        }

        if (error.message && error.message.includes('\n')) {
            error = error.message.split('\n').pop();
        }

        return {
            error,
            source
        };
    }

    return item;

}

function isNormal(meta) {
    return (meta.result.Orientation && typeof meta.result.Orientation === 'number' && orientations[meta.result.Orientation - 1].includes('normal')) ? true : false;
}

async function generate(list, options = {}, exiftool = null, items = [], create = {}, main = null) {

    if (typeof list === 'string') {
        list = [list];
    }

    if (typeof options !== 'object') {
        return main = {
            error: `Expected options object got ${typeof options} instead`
        };
    }

    if (!options.destination) {
        options.destination = temp;
    } else {
        options.destination = path.resolve(options.destination);
    }

    const target = path.parse(list.shift());
    const source = `${target.dir}/${target.name}${target.ext}`;
    let preview = `${options.destination}/${target.name}.jpg`;

    if (await exists(preview)) {
        preview = `${options.destination}/${target.name}-${Array.from(shortid.generate()).slice(0, 9).join('')}.jpg`;
    }

    if (!master.exiftool && (!exiftool && !options.persist)) {
        exiftool = new ExifTool({
            exiftoolArgs
        });
    }

    if (!master.exiftool && options.persist) {
        master.persist = true;
        master.exiftool = new ExifTool({
            exiftoolArgs
        });
    }

    const meta = await outcome((master.exiftool || exiftool).read(source));

    if (meta.success) {

        let listPreviews = Object.keys(meta.result).filter(item => {
            return previews.some(current => current.includes(item));
        }).shift();

        if (listPreviews) {

            if (options.base64 && isNormal(meta)) {

                create = await outcome((master.exiftool || exiftool).extractBinaryTagToBuffer(listPreviews, source));

                if (create.success) {

                    const content = (!options.datauri) ? create.result.toString('base64') : 'data:image/jpeg;base64,' + create.result.toString('base64');

                    main = {
                        preview: !options.stream ? content : bufferToStream(content),
                        source
                    };
                }

            } else {

                create = await outcome((master.exiftool || exiftool)[`extract${listPreviews.replace('Image', '')}`](source, preview));

                if (create.success) {

                    if (meta.result.Orientation && typeof meta.result.Orientation === 'number') {

                        await (master.exiftool || exiftool).write(preview, {
                            Orientation: orientations[meta.result.Orientation - 1]
                        }, ['-overwrite_original_in_place']);

                    }

                    main = {
                        preview: !options.stream ? await baseCheck(preview, options.base64, options.datauri) : streamWipe(preview, options.base64, options.datauri),
                        source
                    };

                }
            }

        }

    }

    items.push(result(source, [main, meta.error, create.error].filter(item => item)));

    if (list.length) {
        return generate(list, options, exiftool, items);
    }

    if (!options.persist && exiftool) {
        await exiftool.end();
    }

    if (!options.persist && master.exiftool) {
        await desist();
    }

    if (options.compact) {
        items = items.filter(item => item.preview).map(item => item.preview);
    }

    return (items.length === 1) ? items.shift() : items;

}

module.exports = {
    status,
    desist,
    generate
};