# extractd

[![NPM version](https://img.shields.io/npm/v/extractd.svg)](https://npmjs.org/package/extractd)
[![Downloads](https://img.shields.io/npm/dm/extractd.svg)](https://npmjs.org/package/extractd)
[![CircleCI](https://img.shields.io/circleci/project/github/przemyslawpluta/extractd/master.svg)](https://circleci.com/gh/przemyslawpluta/extractd/tree/master)

Extract previews from DSLR and mirrorless cameras' RAW files.

## Installation

```bash
npm i extractd
```

## Examples

Multiple examples can be located in [examples](https://github.com/przemyslawpluta/extractd/blob/master/examples) directory

## Usage

Workflow allows to extract previews directly from RAW files. Available options:

- **compact** `optional (boolean)` - returns compact list of the preview files (defaults to false).
- **destination** `optional (string)` - directory where preview image will be saved (defaults to RAW image directory).
- **stream** `optional (boolean)` - by default `exif` process generates the preview file in the temp directory in the OS or in `destination` if provided; once enabled `preview` is returned as a readeble stream which source will by automatically deleted after fully piped (defaults to false).
- **persist** `optional (boolean)` - by default `exif` process will be initialised and killed of per extractd call; with `persist` enabled same `exif` process can be used across all calls for single file and batch processing (defaults to false).

### Basic usage

```js
const extractd = require('extractd');

(async () => {

    const done = await extractd.generate('/directory/nikon_d850_01.nef');

})();
```

Response `done (object)` will be similar to:

```js
  {
    preview: '/tempdirectory/nikon_d850_01.jpg',
    source: '/directory/nikon_d850_01.nef'
  }
```

- preview - location of the preview image
- source - location of the original RAW image

### Persistent status check

```js

const done = await extractd.generate('/directory/nikon_d850_01.nef', {
  persist: true,
  destination: '/directory/'
});

const status = extractd.status();

```

Response `done (object)` will be similar to:

```js
  {
    preview: '/directory/nikon_d850_01.jpg',
    source: '/directory/nikon_d850_01.nef'
  }
```

Response `status (object)` will be similar to:

```js
{
  persistent: true
}
```

- persistent - status indicates that `exif` process is already live and additional calls can join in or next call should terminate it

### Basic stream usage

```js
const extractd = require('extractd');
const pipeline = require('util').promisify(require('stream').pipeline);

(async () => {

    const done = await extractd.generate('/directory/nikon_d850_01.nef', {
        stream: true
    });

    await pipeline(done.preview, require('fs').createWriteStream('/my/new/directory/nikon_d850_01.jpg'));

})();
```

Response `done (object)` will be similar to:

```js
  {
    preview: ReadStream,
    source: '/directory/nikon_d850_01.nef'
  }
```

- preview - readable stream which source will be deleted once fully piped
- source - location of the original RAW image

### Complex usage

```js
const canon = await extractd.generate('/directory/canon_eos_5d_mark_iv_01.cr2', {
  compact: true,
  persist: true
});

const nikon = await extractd.generate('/directory/nikon_d850_01.nef', {
  compact: true,
  persist: true
});

const panasonic = await extractd.generate('/directory/panasonic_s1r_01.rw2', {
  compact: true
});

const done = [canon, nikon, panasonic];

```

Response `done (array)` will be similar to:

```js
[
  '/tempdirectory/canon_eos_5d_mark_iv_01.jpg',
  '/tempdirectory/nikon_d850_01.jpg',
  '/tempdirectory/panasonic_s1r_01.jpg'
]
```

As `persist` option was used only single `exif` process was used across all three calls. Last item terminates `exif` process as `persist` defaults to `false`.

### Batch usage

```js
const extractd = require('extractd');

(async () => {

    const done = await extractd.generate([
      '/directory/nikon_d850_01.nef',
      '/directory/sony_a7r_iii_01.arw',
      '/directory/pentax_k_1_mark_ii_01.dng'
    ]);

})();
```

Response `done (array)` will be similar to:

```js
  [
    {
      preview: '/tempdirectory/nikon_d850_01.jpg',
      source: '/directory/nikon_d850_01.nef'
    },
    {
      preview: '/tempdirectory/sony_a7r_iii_01.jpg',
      source: '/directory/sony_a7r_iii_01.arw'
    },
    {
      preview: '/tempdirectory/pentax_k_1_mark_ii_01.jpg',
      source: '/directory/pentax_k_1_mark_ii_01.dng'
    }
  ]
```

### Advanced usage

```js
const extractd = require('extractd');

(async () => {

    const batch = await extractd.generate([
      '/directory/nikon_d850_01.nef',
      '/directory/sony_a7r_iii_01.arw',
      '/directory/pentax_k_1_mark_ii_01.dng'
    ], {
      persist: true
    });

    const file01 = await extractd.generate('/directory/fujifilm_gfx_50s_01.raf', {
      persist: true
    });

    const file02 = await extractd.generate('/directory/panasonic_s1r_01.rw2');

    const done = [...batch, ...[file01], ...[file02]];

})();
```

Response `done (array)` will be similar to:

```js
  [
    {
      preview: '/tempdirectory/nikon_d850_01.jpg',
      source: '/directory/nikon_d850_01.nef'
    },
    {
      preview: '/tempdirectory/sony_a7r_iii_01.jpg',
      source: '/directory/sony_a7r_iii_01.arw'
    },
    {
      preview: '/tempdirectory/pentax_k_1_mark_ii_01.jpg',
      source: '/directory/pentax_k_1_mark_ii_01.dng'
    },
    {
      preview: '/tempdirectory/fujifilm_gfx_50s_01.jpg',
      source: '/directory/fujifilm_gfx_50s_01.raf'
    },
    {
      preview: '/tempdirectory/panasonic_s1r_01.jpg',
      source: '/directory/panasonic_s1r_01.rw2'
    }
  ]
```

As `persist` option was used only single `exif` process was used across all three calls. Last item terminates `exif` process as `persist` defaults to `false`.

## Errors

All erros are resolved and fallow similar convention:

```js
const extractd = require('extractd');

(async () => {

    const done = await extractd.generate('/directory/dummyFile.nef');

})();
```

Response `done (object)` will be similar to:

```js
{
  error: 'File not found',
  source: '/directory/dummyFile.nef'
}
```

## Tests

To run all available tests

```bash
npm test
```

## License

The MIT License (MIT). Please see [license](https://github.com/przemyslawpluta/extractd/blob/master/LICENSE) file for more information.
