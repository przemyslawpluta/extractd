const extractd = require('../extractd');

(async () => {

    const done = await extractd.generate([
        'nikon_d850_01.nef',
        'panasonic_s1r_01.rw2'
    ], {
        compact: true
    });

    console.dir(done);

})();