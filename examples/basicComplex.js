const extractd = require('../extractd');

(async () => {

    const files = [];

    files.push(await extractd.generate('canon_eos_5d_mark_iv_01.cr2', {
        persist: true
    }));

    files.push(await extractd.generate('nikon_d850_01.nef', {
        persist: true
    }));

    files.push(await extractd.generate('sony_a7r_iii_01.arw'));

    console.dir(files);

})();