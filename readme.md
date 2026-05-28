# search-closest

[![Npm Version][package_version_badge]][package_link]
[![MIT License][license_badge]][license_link]
[![Coverage][coverage_badge]][coverage_link]

[coverage_badge]: https://img.shields.io/codecov/c/github/fisker/search-closest.svg?style=flat-square
[coverage_link]: https://app.codecov.io/gh/fisker/search-closest
[license_badge]: https://img.shields.io/npm/l/search-closest.svg?style=flat-square
[license_link]: https://github.com/fisker/search-closest/blob/main/license
[package_version_badge]: https://img.shields.io/npm/v/search-closest.svg?style=flat-square
[package_link]: https://www.npmjs.com/package/search-closest

> Find closest file or directory by names.

## Install

```bash
yarn add search-closest
```

## Usage

```js
import {
  FileSearcher,
  DirectorySearcher,
  Searcher,
  searchClosestFile,
  searchClosestDirectory,
  searchClosest,
} from 'search-closest'

const fileSearcher = new FileSearcher(['config.json', 'config.yaml'])
console.log(await fileSearcher.search())
// "/path/to/config.json"

const directorySearcher = new DirectorySearcher(['.git'])
console.log(await directorySearcher.search())
// "/path/to/.git"

const searcher = new Searcher(
  ['yarn.lock', '.yarn'],
  ({name, stats}) =>
    (name === 'yarn.lock' && stats.isFile()) ||
    (name === '.yarn' && stats.isDirectory()),
)
console.log(await searcher.search())
// "/path/to/yarn.lock"

console.log(await searchClosestFile(['config.json', 'config.yaml']))
// "/path/to/config.json"

console.log(await searchClosestDirectory(['.git']))
// "/path/to/.git"

console.log(
  await searchClosest(
    ['yarn.lock', '.yarn'],
    ({name, stats}) =>
      (name === 'yarn.lock' && stats.isFile()) ||
      (name === '.yarn' && stats.isDirectory()),
  ),
)
// "/path/to/yarn.lock"
```

## API

```js
import {FileSearcher, DirectorySearcher, Searcher} from 'search-closest'

const fileSearcher = new FileSearcher(['config.json', 'config.yaml'])
console.log(await fileSearcher.search())
// "/path/to/config.json"

const directorySearcher = new DirectorySearcher(['.git'])
console.log(await directorySearcher.search())
// "/path/to/.git"

const searcher = new Searcher([
  {name: 'yarn.lock', type: 'file'},
  {name: '.yarn', type: 'directory'},
])
console.log(await searcher.search())
// "/path/to/yarn.lock"
```

## Signatures (Searcher)

### `new {File,Directory,}Searcher(targetOrTargets: TargetOrTargets)`

### `new {File,Directory,}Searcher(targetOrTargets: TargetOrTargets, options: Options)`

### `new {File,Directory,}Searcher(targetOrTargets: TargetOrTargets, filter: Options["filter"])`

### `new {File,Directory,}Searcher(targetOrTargets: TargetOrTargets, filter: Options["filter"], options: Omit<Options, "filter">)`

## Types (Searcher)

### `TargetOrTargets` (Searcher)

The files or directories to find.

Type: `Target | Target[]`

#### `Target` (Searcher)

The files or directories to find.

Type: `string | {name: string, type?: 'file' | 'directory', filter?: Options["filter"]}`

#### `Target["type"]` (Searcher)

The file or directory type looking for.

```js
import fs from 'node:fs/promises'
import {Searcher} from 'search-closest'

const searcher = new Searcher([
  {name: 'yarn.lock', type: 'file'},
  {name: '.yarn', type: 'directory'},
])
console.log(await searcher.search())
// "/path/to/yarn.lock"
```

_`Target.type` is ignored in `new FileSearcher()` and `new DirectorySearcher()`, only works in `new Searcher()`_

### `Options` (Searcher)

Type: `object`

#### `Options.allowSymlinks` (Searcher)

Type: `boolean`\
Default: `true`

Whether symlinks should be matched.

##### `Options.filter` (Searcher)

Type: `(fileOrDirectory: {name: string, path: string, stats: fs.Stats}) => Promise<boolean>`

To exclude specific file or directory.

##### `Options.stopDirectory` (Searcher)

Type: `URL | string`\
Default: Root directory

The last directory to search before stopping.

##### `Options.cache` (Searcher)

Type: `boolean`
Default: `true`

Whether the search result should be cached.

### `{File,Directory,}Searcher#search(startDirectory?, options)`

#### `startDirectory` (Searcher#search)

Type: `URL | string`\
Default: `process.cwd()`

Where the search begins.

#### `options` (Searcher#search)

Type: `object`

#### `options.cache` (Searcher#search)

Type: `boolean`
Default: `true`

Whether the result cache should be used.

### `{File,Directory,}Searcher#clearCache()`

Clear cached search result.

### `searchClosest{File,Directory,}()`

> [!Warning]
>
> The search result won't be cached, use the `FileSearcher`, `DirectorySearcher`, or `Searcher` if you want more efficient functionality.

```js
import {
  searchClosestFile,
  searchClosestDirectory,
  searchClosest,
} from 'search-closest'

console.log(await searchFile(['config.json', 'config.yaml']))
// "/path/to/config.json"

console.log(await searchDirectory(['.git']))
// "/path/to/.git"

console.log(
  await searchClosest([
    {name: 'yarn.lock', type: 'file'},
    {name: '.yarn', type: 'directory'},
  ]),
)
// "/path/to/yarn.lock"
```

## Signatures (searchClosest)

### `searchClosest{File,Directory,}(targetOrTargets: TargetOrTargets)`

### `searchClosest{File,Directory,}(targetOrTargets: TargetOrTargets, options: Options)`

### `searchClosest{File,Directory,}(targetOrTargets: TargetOrTargets, filter: Options["filter"])`

### `searchClosest{File,Directory,}(targetOrTargets: TargetOrTargets, filter: Options["filter"], options: Omit<Options, "filter">)`

## Types (searchClosest)

### `TargetOrTargets` (searchClosest)

The files or directories to find.

Type: `Target | Target[]`

#### `Target` (searchClosest)

The files or directories to find.

Type: `string | {name: string, type?: 'file' | 'directory', filter?: Options["filter"]}`

#### `Target["type"]` (searchClosest)

The file or directory type looking for.

```js
import fs from 'node:fs/promises'
import {searchClosest} from 'search-closest'

console.log(
  await searchClosest([
    {name: 'yarn.lock', type: 'file'},
    {name: '.yarn', type: 'directory'},
  ]),
)
// "/path/to/yarn.lock"
```

_`Target.type` is ignored in `searchClosestFile()` and `searchClosestDirectory()`, only works in `searchClosest()`_

### `Options` (searchClosest)

Type: `object`

#### `Options.cwd` (searchClosest)

Type: `URL | string`\
Default: `process.cwd()`

The directory start to search.

##### `Options.allowSymlinks` (searchClosest)

Type: `boolean`\
Default: `true`

Whether symlinks should be matched.

##### `Options.filter` (searchClosest)

Type: `(fileOrDirectory: {name: string, path: string, stats: fs.Stats}) => Promise<boolean>`

To exclude specific file or directory.

##### `Options.stopDirectory` (searchClosest)

Type: `URL | string`\
Default: Root directory

The last directory to search before stopping.
