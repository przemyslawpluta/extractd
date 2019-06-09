const extractd = require('../extractd');

(async () => {

    const done = await extractd.generate([
        'canon_eos_5d_mark_iv_01.cr2',
        'nikon_d850_01.nef',
        'panasonic_s1r_01.rw2'
    ]);

    console.dir(done);

})();