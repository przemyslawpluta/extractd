const fs = require('fs');
const util = require('util');
const path = require('path');
const expect = require('chai').expect;
const extractd = require('../extractd');

const del = util.promisify(fs.unlink);

const samples = path.resolve(__dirname, '..', 'samples');

describe('# extract single file', () => {

    context('with missing file', () => {

        it('should return file not found error', async () => {
            const source = 'dummyFile.nef';
            const done = await extractd(source, {
                persist: true
            });

            expect(done).to.be.an('object');

            expect(done).to.deep.equal({
                error: 'File not found',
                source: `/${source}`
            });

        });

    });

    context('with existing file and set destination', () => {

        let done = {};
        const source = `${samples}/nikon_d850_01.nef`;

        it('should return an object', async () => {

            done = await extractd(source, {
                persist: true,
                destination: samples
            });

            expect(done).to.be.an('object');

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


});