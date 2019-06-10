const extractd = require('../extractd');

(async () => {

    const done = await extractd.generate('nikon_d850_01.nef', {
        destination: '/my/new/directory/'
    });

    console.dir(done);

})();