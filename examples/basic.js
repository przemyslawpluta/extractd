const extractd = require('../extractd');

(async () => {

    const done = await extractd('nikon_d850_01.nef');
    console.dir(done);

})();