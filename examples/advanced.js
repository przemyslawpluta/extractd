const extractd = require('../extractd');

(async () => {

    const photo001 = await extractd('canon_eos_5d_mark_iv_01.cr2', {
        destination: '/directory/',
        persist: true
    });

    const photo002 = await extractd('nikon_d850_01.nef', {
        destination: '/secondary/directory/',
        persist: true
    });

    const batch001 = await extractd([
        'pentax_k_1_mark_ii_01.dng',
        'sony_a7r_iii_01.arw',
        'fujifilm_gfx_50s_01.raf'
    ], {
        persist: true
    });

    const batch002 = await extractd([
        'google_pixel_3a_01.dng',
        'panasonic_s1r_01.rw2'
    ]);

    const combined = [...batch001, ...batch002, ...[photo001], ...[photo002]];

    console.dir(combined);

})();