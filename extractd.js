const fs = require('fs');
const path = require('path');
const temp = require('temp-dir');
const ExifTool = require('exiftool-vendored').ExifTool;

let globalExif = null;

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

function remove(target) {
    return new Promise((resolve, reject) => {
        fs.unlink(target, (err) => {
            if (err) {
                return reject(err);
            };
            resolve();
        });
    });
}

async function extractd(list, options = {}, exiftool = null, items = [], main = {}) {

    if (typeof list === 'string') {
        list = [list];
    }

    if (!options.destination) {
        options.destination = temp;
    } else {
        options.destination = path.normalize(options.destination);
    }

    const target = path.parse(list.shift());
    const source = target.dir + '/' + target.name + target.ext;
    const preview = options.destination + '/' + target.name + '.jpg';

    await outcome(remove(preview));

    if (!globalExif && (!exiftool && !options.persist)) {
        exiftool = new ExifTool({
            exiftoolArgs
        });
    }

    if (!globalExif && options.persist) {
        globalExif = new ExifTool({
            exiftoolArgs
        });
    }

    const meta = await outcome((globalExif || exiftool).read(source));

    if (meta.success) {

        let listPreviews = Object.keys(meta.result).filter(item => {
            return previews.some(current => current.includes(item));
        }).shift();

        if (listPreviews) {

            await (globalExif || exiftool)[`extract${listPreviews.replace('Image', '')}`](source, preview);

            if (meta.result.Orientation && typeof meta.result.Orientation === 'number') {

                await (globalExif || exiftool).write(preview, {
                    Orientation: orientations[meta.result.Orientation - 1]
                }, ['-overwrite_original_in_place']);

            }

            main = {
                preview,
                source
            };

        } else {
            main = {
                error: 'No preview detected in the file',
                source
            };
        }

    } else {
        main = {
            error: (meta.error.message) ? meta.error.message.split(' - ').shift() : meta.error,
            source
        }
    }

    items.push(main);

    if (list.length) {
        return extractd(list, options, exiftool, items);
    }

    if (!options.persist) {
        (globalExif || exiftool).end();
    }

    if (options.compact) {
        items = items.filter(item => item.preview).map(item => item.preview);
    }

    return (items.length === 1) ? items.shift() : items;

};

module.exports = extractd;