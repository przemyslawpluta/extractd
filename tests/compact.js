const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const extractd = require('../extractd');

const del = fs.promises.unlink;

const samples = path.resolve(__dirname, '..', 'samples');

describe('# compact batch extract files', () => {

    context('with missing and existing files in compact view', () => {

        let done = {};

        const source = [
            `${samples}/nikon_d850_01.nef`,
            `${samples}/nikon_z7_ii_01.nef`,
            `${samples}/nikon_z9_01.nef`,
            `${samples}/canon_eos_5d_mark_iv_01.cr2`,
            `${samples}/canon_eos_1d_x_mark_iii_01.cr3`,
            `${samples}/sony_a7r_iii_01.arw`,
            `${samples}/sony_a9_ii_01.arw`,
            `${samples}/panasonic_s1r_01.rw2`,
            `${samples}/panasonic_lumix_gh5_ii_01.rw2`,
            `${samples}/pentax_k_1_mark_ii_01.dng`,
            `${samples}/fujifilm_x_t3_01.raf`,
            `${samples}/fujifilm_x_s10_01.raf`,
            `${samples}/leica_cl_01.dng`,
            `${samples}/leica_v_lux_5_01.rwl`,
            `${samples}/sigma_sd1_merrill_01.x3f`,
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

            expect(done).to.have.lengthOf(15);

        });

        it('array should not contain error', () => {

            const item = done.filter(item => item.error);

            expect(item).to.be.an('array');

            expect(item).to.have.lengthOf(0);

        });

        it('nikon d850 preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('nikon_d850')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('nikon z7 preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('nikon_z7')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('nikon z9 preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('nikon_z9')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('canon eos 5d preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('canon_eos_5d')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('canon eos 1d preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('canon_eos_1d')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('sony a7r preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('sony_a7r')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('sony a9 preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('sony_a9')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('panasonic s1r preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('panasonic_s1r')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('panasonic lumix preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('panasonic_lumix')).shift();

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

        it('fujifilm x t3 preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('fujifilm_x_t3')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('fujifilm x s10 preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('fujifilm_x_s10')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('leica cl preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('leica_cl')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('leica v preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('leica_v')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

        it('sigma preview should be returned in array', async () => {

            const item = done.filter(item => item.includes('sigma')).shift();

            expect(item).to.be.a('string');

            expect(path.extname(item)).to.deep.equal('.jpg');

            await del(item);

        });

    });

});