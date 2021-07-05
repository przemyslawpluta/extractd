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
            `${samples}/nikon_z7_ii_01.nef`,
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
            `${samples}/dummyFile.nef`
        ];

        it('should indicate persistent status with ability to join', () => {

            const status = extractd.status();

            expect(status.persistent).to.be.true;

        });

        it('should return an array', async () => {

            done = await extractd.generate(source, {
                destination: samples
            });

            expect(done).to.be.an('array');

            expect(done).to.have.lengthOf(14);

        });

        it('array should contain file not found error', () => {

            const item = done.filter(item => item.error === 'File not found').shift();

            expect(item).to.be.an('object');

            expect(item).to.deep.equal({
                error: 'File not found',
                source: `${samples}/dummyFile.nef`
            });

        });

        it('nikon d850 preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('nikon_d850')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('nikon z7 preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('nikon_z7')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('canon eos 5d preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('canon_eos_5d')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('canon eos 1d preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('canon_eos_1d')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('sony a7r preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('sony_a7r')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('sony a9 preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('sony_a9')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('panasonic s1r preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('panasonic_s1r')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('panasonic lumix preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('panasonic_lumix')).shift();

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

        it('fujifilm x t3 preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('fujifilm_x_t3')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('fujifilm x s10 preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('fujifilm_x_s10')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('leica cl preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('leica_cl')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

        it('leica v preview item in the array should contain objects with preview and source files', async () => {

            const item = done.filter(item => item.preview).filter(item => item.preview.includes('leica_v')).shift();

            expect(item).to.have.own.property('preview');
            expect(item).to.have.own.property('source');

            expect(path.dirname(item.source)).to.be.deep.equal(path.dirname(item.preview));

            expect(path.basename(item.source, path.extname(item.source))).to.be.deep.equal(path.basename(item.preview, '.jpg'));

            expect(path.extname(item.preview)).to.deep.equal('.jpg');

            await del(item.preview);

        });

    });

});