const fs = require('fs');
const stream = require('stream');
const util = require('util');
const path = require('path');
const expect = require('chai').expect;
const extractd = require('../extractd');

const del = fs.promises.unlink;
const read = fs.promises.readFile;
const pipeline = util.promisify(stream.pipeline);

const samples = path.resolve(__dirname, '..', 'samples');

describe('# extract single file', () => {

    context('with missing file', () => {

        it('should return file not found error', async () => {
            const source = 'dummyFile.nef';
            const done = await extractd.generate(source);

            expect(done).to.be.an('object');

            expect(done).to.deep.equal({
                error: 'File not found',
                source: `/${source}`
            });

        });

        it('should indicate no persistent status', () => {

            const status = extractd.status();

            expect(status.persistent).to.be.false;

        });

    });

    context('with existing file but non jpg preview format', () => {

        it('should return file not found error', async () => {

            const source = `${samples}/hasselblad_x1d_01.fff`;
            const done = await extractd.generate(source);

            expect(done).to.be.an('object');

            expect(done).to.deep.equal({
                error: 'No preview detected',
                source: `${source}`
            });

        });

        it('should indicate no persistent status', () => {

            const status = extractd.status();

            expect(status.persistent).to.be.false;

        });

    });

    context('with existing file but unable to create destination directory', () => {

        it('should return file not found error', async () => {

            const file = 'nikon_d850_01';
            const destination = '/root/my/new/directory/';

            const source = `${samples}/${file}.nef`;
            const done = await extractd.generate(source, {
                destination
            });

            expect(done).to.be.an('object');

            expect(done).to.deep.equal({
                error: `Error creating ${destination}${file}.jpg`,
                source: `${source}`
            });

        });

        it('should indicate no persistent status', () => {

            const status = extractd.status();

            expect(status.persistent).to.be.false;

        });

    });

    context('with existing file and set destination', () => {

        let done = {};
        const source = `${samples}/nikon_d850_01.nef`;

        it('should return an object', async () => {

            done = await extractd.generate(source, {
                persist: true,
                destination: samples
            });

            expect(done).to.be.an('object');

        });

        it('should indicate persistent status with ability to join', () => {

            const status = extractd.status();

            expect(status.persistent).to.be.true;

        });

        it('should indicate desist status', async () => {

            const status = await extractd.desist();

            expect(status.persistent).to.be.false;

        });

        it('object should contain preview and original source', () => {

            expect(done).to.have.own.property('preview');
            expect(done).to.have.own.property('source');

        });

        it('source directory and preview destination should be the same', () => {

            expect(path.dirname(done.source)).to.be.deep.equal(path.dirname(done.preview));

        });

        it('should generate preview file', async () => {

            const preview = path.basename(done.preview);

            expect(preview).to.be.deep.equal(path.basename(source, '.nef') + '.jpg');

            await del(done.preview);

        });

    });

    context('with existing file and base64 outcome', () => {

        let done = {};
        const source = `${samples}/nikon_d850_01.nef`;

        it('should return an object', async () => {

            done = await extractd.generate(source, {
                base64: true,
                persist: true
            });

            expect(done).to.be.an('object');

        });

        it('should indicate persistent status with ability to join', () => {

            const status = extractd.status();

            expect(status.persistent).to.be.true;

        });

        it('should indicate desist status', async () => {

            const status = await extractd.desist();

            expect(status.persistent).to.be.false;

        });

        it('object should contain preview and original source', () => {

            expect(done).to.have.own.property('preview');
            expect(done).to.have.own.property('source');

        });

        it('should be base64 jpg encoded string', async () => {

            const id = done.preview.substring(0, 4);

            expect(id).to.be.deep.equal('/9j/');

        });
    });

    context('with existing file orientation change and base64 outcome', () => {

        let done = {};
        const source = `${samples}/fujifilm_x_t3_01.raf`;

        it('should return an object', async () => {

            done = await extractd.generate(source, {
                base64: true,
                persist: true
            });

            expect(done).to.be.an('object');

        });

        it('should indicate persistent status with ability to join', () => {

            const status = extractd.status();

            expect(status.persistent).to.be.true;

        });

        it('should indicate desist status', async () => {

            const status = await extractd.desist();

            expect(status.persistent).to.be.false;

        });

        it('object should contain preview and original source', () => {

            expect(done).to.have.own.property('preview');
            expect(done).to.have.own.property('source');

        });

        it('should be base64 jpg encoded string', async () => {

            const id = done.preview.substring(0, 4);

            expect(id).to.be.deep.equal('/9j/');

        });
    });

    context('with existing file and base64 datauri outcome', () => {

        let done = {};
        const source = `${samples}/nikon_d850_01.nef`;

        it('should return an object', async () => {

            done = await extractd.generate(source, {
                base64: true,
                datauri: true,
                persist: true
            });

            expect(done).to.be.an('object');

        });

        it('should indicate persistent status with ability to join', () => {

            const status = extractd.status();

            expect(status.persistent).to.be.true;

        });

        it('should indicate desist status', async () => {

            const status = await extractd.desist();

            expect(status.persistent).to.be.false;

        });

        it('object should contain preview and original source', () => {

            expect(done).to.have.own.property('preview');
            expect(done).to.have.own.property('source');

        });

        it('should be base64 datauri jpg encoded string', async () => {

            const id = done.preview.substring(0, 27);

            expect(id).to.be.deep.equal('data:image/jpeg;base64,/9j/');

        });
    });

    context('with existing file orientation change and base64 datauri outcome', () => {

        let done = {};
        const source = `${samples}/fujifilm_x_t3_01.raf`;

        it('should return an object', async () => {

            done = await extractd.generate(source, {
                base64: true,
                datauri: true,
                persist: true
            });

            expect(done).to.be.an('object');

        });

        it('should indicate persistent status with ability to join', () => {

            const status = extractd.status();

            expect(status.persistent).to.be.true;

        });

        it('should indicate desist status', async () => {

            const status = await extractd.desist();

            expect(status.persistent).to.be.false;

        });

        it('object should contain preview and original source', () => {

            expect(done).to.have.own.property('preview');
            expect(done).to.have.own.property('source');

        });

        it('should be base64 datauri jpg encoded string', async () => {

            const id = done.preview.substring(0, 27);

            expect(id).to.be.deep.equal('data:image/jpeg;base64,/9j/');

        });
    });

    context('with existing file and set destination outcome as a stream', () => {

        let done = {};
        const source = `${samples}/nikon_d850_01.nef`;
        const pipedFile = `${samples}/myNewPipedFile.jpg`;

        it('should return an object', async () => {

            done = await extractd.generate(source, {
                stream: true,
                persist: true,
                destination: samples
            });

            expect(done).to.be.an('object');

        });

        it('object should contain preview and original source', () => {

            expect(done).to.have.own.property('preview');
            expect(done).to.have.own.property('source');

        });

        it('preview should be accessible as a stream', () => {

            expect(typeof done.preview.on === 'function').to.be.true;

        });

        it('source directory and preview destination should be the same', () => {

            expect(path.dirname(done.source)).to.be.deep.equal(path.dirname(done.preview.path));

        });

        it('should generate temp streamable preview file', async () => {

            const preview = path.basename(done.preview.path);

            expect(preview).to.be.deep.equal(path.basename(source, '.nef') + '.jpg');

        });

        it('preview can be piped in to a file stream', async () => {

            await pipeline(done.preview, fs.createWriteStream(pipedFile));

            expect(path.dirname(done.source)).to.be.deep.equal(path.dirname(pipedFile));

        });

        it('should generate preview file', async () => {

            const preview = path.basename(pipedFile);

            expect(preview).to.be.deep.equal(path.basename(pipedFile));

            await del(pipedFile);

        });

    });

    context('with existing file and set destination outcome as a base64 stream', () => {

        let done = {};
        const source = `${samples}/nikon_d850_01.nef`;
        const pipedFile = `${samples}/myNewBase64PipedFile.txt`;

        it('should return an object', async () => {

            done = await extractd.generate(source, {
                stream: true,
                base64: true,
                persist: true,
                destination: samples
            });

            expect(done).to.be.an('object');

        });

        it('object should contain preview and original source', () => {

            expect(done).to.have.own.property('preview');
            expect(done).to.have.own.property('source');

        });

        it('preview should be accessible as a stream', () => {

            expect(typeof done.preview.on === 'function').to.be.true;

        });

        it('preview can be piped in to a file stream', async () => {

            await pipeline(done.preview, fs.createWriteStream(pipedFile));

            expect(path.dirname(done.source)).to.be.deep.equal(path.dirname(pipedFile));

        });

        it('should generate preview file', async () => {

            const preview = path.basename(pipedFile);

            expect(preview).to.be.deep.equal(path.basename(pipedFile));

        });

        it('should be base64 jpg encoded file', async () => {

            const content = (await read(pipedFile)).toString();

            const id = content.substring(0, 4);

            expect(id).to.be.deep.equal('/9j/');

            await del(pipedFile);

        });

    });

    context('with existing file orientation change and set destination outcome as a base64 stream', () => {

        let done = {};
        const source = `${samples}/fujifilm_x_t3_01.raf`;
        const pipedFile = `${samples}/myNewBase64PipedFile.txt`;

        it('should return an object', async () => {

            done = await extractd.generate(source, {
                stream: true,
                base64: true,
                persist: true,
                destination: samples
            });

            expect(done).to.be.an('object');

        });

        it('object should contain preview and original source', () => {

            expect(done).to.have.own.property('preview');
            expect(done).to.have.own.property('source');

        });

        it('preview should be accessible as a stream', () => {

            expect(typeof done.preview.on === 'function').to.be.true;

        });

        it('preview can be piped in to a file stream', async () => {

            await pipeline(done.preview, fs.createWriteStream(pipedFile));

            expect(path.dirname(done.source)).to.be.deep.equal(path.dirname(pipedFile));

        });

        it('should generate preview file', async () => {

            const preview = path.basename(pipedFile);

            expect(preview).to.be.deep.equal(path.basename(pipedFile));

        });

        it('should be base64 jpg encoded file', async () => {

            const content = (await read(pipedFile)).toString();

            const id = content.substring(0, 4);

            expect(id).to.be.deep.equal('/9j/');

            await del(pipedFile);

        });

    });

    context('with existing file and set destination outcome as a base64 datauri stream', () => {

        let done = {};
        const source = `${samples}/nikon_d850_01.nef`;
        const pipedFile = `${samples}/myNewBase64URIPipedFile.txt`;

        it('should return an object', async () => {

            done = await extractd.generate(source, {
                stream: true,
                base64: true,
                datauri: true,
                persist: true,
                destination: samples
            });

            expect(done).to.be.an('object');

        });

        it('object should contain preview and original source', () => {

            expect(done).to.have.own.property('preview');
            expect(done).to.have.own.property('source');

        });

        it('preview should be accessible as a stream', () => {

            expect(typeof done.preview.on === 'function').to.be.true;

        });

        it('preview can be piped in to a file stream', async () => {

            await pipeline(done.preview, fs.createWriteStream(pipedFile));

            expect(path.dirname(done.source)).to.be.deep.equal(path.dirname(pipedFile));

        });

        it('should generate preview file', async () => {

            const preview = path.basename(pipedFile);

            expect(preview).to.be.deep.equal(path.basename(pipedFile));

        });

        it('should be base64 datauri jpg encoded file', async () => {

            const content = (await read(pipedFile)).toString();

            const id = content.substring(0, 27);

            expect(id).to.be.deep.equal('data:image/jpeg;base64,/9j/');

            await del(pipedFile);

        });

    });

    context('with existing file and set destination outcome as a base64 datauri stream', () => {

        let done = {};
        const source = `${samples}/fujifilm_x_t3_01.raf`;
        const pipedFile = `${samples}/myNewBase64URIPipedFile.txt`;

        it('should return an object', async () => {

            done = await extractd.generate(source, {
                stream: true,
                base64: true,
                datauri: true,
                persist: true,
                destination: samples
            });

            expect(done).to.be.an('object');

        });

        it('object should contain preview and original source', () => {

            expect(done).to.have.own.property('preview');
            expect(done).to.have.own.property('source');

        });

        it('preview should be accessible as a stream', () => {

            expect(typeof done.preview.on === 'function').to.be.true;

        });

        it('preview can be piped in to a file stream', async () => {

            await pipeline(done.preview, fs.createWriteStream(pipedFile));

            expect(path.dirname(done.source)).to.be.deep.equal(path.dirname(pipedFile));

        });

        it('should generate preview file', async () => {

            const preview = path.basename(pipedFile);

            expect(preview).to.be.deep.equal(path.basename(pipedFile));

        });

        it('should be base64 datauri jpg encoded file', async () => {

            const content = (await read(pipedFile)).toString();

            const id = content.substring(0, 27);

            expect(id).to.be.deep.equal('data:image/jpeg;base64,/9j/');

            await del(pipedFile);

        });

    });

});