const fs = require('fs');
const util = require('util');
const path = require('path');
const expect = require('chai').expect;
const extractd = require('../extractd');

const del = util.promisify(fs.unlink);

const samples = path.resolve(__dirname, '..', 'samples');

describe('# compact batch extract files', () => {

    context('with missing and existing files in compact view', () => {

        let done = {};

        const source = [
            `${samples}/nikon_d850_01.nef`,
            `${samples}/canon_eos_5d_mark_iv_01.cr2`,
            `${samples}/sony_a7r_iii_01.arw`,
            `${samples}/panasonic_s1r_01.rw2`,
            `${samples}/pentax_k_1_mark_ii_01.dng`,
            `${samples}/fujifilm_x_t3_01.raf`,
            `${samples}/leica_cl_01.dng`,
            `${samples}/dummyFile.nef`
        ];

        it('should indicate persistent status with ability to join', () => {

            const status = extractd.status();

            expect(status.persistent).to.be.true;

        });

        it('should return an array', async () => {

            done = await extractd.generate(source, {
                persist: true,
                compact: true,
                destination: samples
            });

            expect(done).to.be.an('array');

            expect(done).to.have.lengthOf(7);

        });

        it('array should not contain error', () => {

            const item = done.filter(item => item.error);

            expect(item).to.be.an('array');

            expect(item).to.have.lengthOf(0);

        });

        it('nikon preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('nikon')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('canon preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('canon')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('sony preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('sony')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('panasonic preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('panasonic')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('pentax preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('pentax')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('fujifilm preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('fujifilm')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('leica preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('leica')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

    });

});