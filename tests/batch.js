const fs = require('fs');
const util = require('util');
const path = require('path');
const expect = require('chai').expect;
const extractd = require('../extractd');

const del = util.promisify(fs.unlink);

const samples = path.resolve(__dirname, '..', 'samples');

describe('# batch extract files', () => {

    context('with missing and existing files', () => {

        let done = {};

        const source = [
            `${samples}/nikon_d850_01.nef`,
            `${samples}/canon_eos_5d_mark_iv_01.cr2`,
            `${samples}/sony_a7r_iii_01.arw`,
            `${samples}/panasonic_s1r_01.rw2`,
            `${samples}/pentax_k_1_mark_ii_01.dng`,
            `${samples}/fujifilm_x_t3_01.raf`,
            `${samples}/dummyFile.nef`
        ];

        it('should return an array', async () => {

            done = await extractd(source, {
                destination: samples
            });

            expect(done).to.be.an('array');

            expect(done).to.have.lengthOf(7);

        });

        it('array should contain file not found error', () => {

            const item = done.filter(item => item.error === 'File not found').shift();

            expect(item).to.be.an('object');

            expect(item).to.deep.equal({
                error: 'File not found',
                source: `${samples}/dummyFile.nef`
            });

        });

        it('nikon preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('nikon')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('canon preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('canon')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('sony preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('sony')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('panasonic preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('panasonic')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('pentax preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('pentax')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('fujifilm preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('fujifilm')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

    });

});