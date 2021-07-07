const extractd = require('../extractd');

(async () => {

    const done = await extractd.generate('nikon_d850_01.nef', {
        base64: true,
        datauri: true
    });

    console.dir(done);

})();