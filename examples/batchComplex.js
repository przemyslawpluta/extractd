const extractd = require('../extractd');

(async () => {

    const firstBatch = await extractd.generate([
        'canon_eos_5d_mark_iv_01.cr2',
        'nikon_d850_01.nef',
        'panasonic_s1r_01.rw2'
    ], {
        persist: true
    });

    const secondBatch = await extractd.generate([
        'pentax_k_1_mark_ii_01.dng',
        'sony_a7r_iii_01.arw',
        'fujifilm_gfx_50s_01.raf'
    ]);

    console.dir([...firstBatch, ...secondBatch]);

})();