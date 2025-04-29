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
  searchFile,
  searchDirectory,
} from 'search-closest'

const fileSearcher = new FileSearcher(['config.json', 'config.yaml'])
console.log(await fileSearcher.search())
// "/path/to/config.json"

const directorySearcher = new DirectorySearcher(['.git'])
console.log(await directorySearcher.search())
// "/path/to/.git"

console.log(await searchFile(['config.json', 'config.yaml']))
// "/path/to/config.json"

console.log(await searchDirectory(['.git']))
// "/path/to/.git"
```

## API

### `new {File,Directory}Searcher(nameOrNames, options?)`

```js
import {FileSearcher, DirectorySearcher} from 'search-closest'

const fileSearcher = new FileSearcher(['config.json', 'config.yaml'])
console.log(await fileSearcher.search())
// "/path/to/config.json"

const directorySearcher = new DirectorySearcher(['.git'])
console.log(await directorySearcher.search())
// "/path/to/.git"
```

#### `nameOrNames` (Searcher)

Type: `string[] | string`

The file or directory name or names to find.

#### `options` (Searcher)

Type: `object`

##### `options.allowSymlinks` (Searcher)

Type: `boolean`\
Default: `true`

Whether symlinks should be matched.

##### `options.filter` (Searcher)

Type: `(fileOrDirectory: {name: string, path: string}) => Promise<boolean>`

To exclude specific file or directory.

##### `options.stopDirectory` (Searcher)

Type: `URL | string`\
Default: Root directory

The last directory to search before stopping.

##### `options.cache` (Searcher)

Type: `boolean`
Default: `true`

Whether the search result should be cached.

### `{File,Directory}Searcher#search(startDirectory?, options)`

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

### `{File,Directory}Searcher#clearCache()`

Clear cached search result.

### `search{File,Directory}(nameOrNames, options?)`

> [!Warning]
>
> The search result won't be cached, use the `FileSearcher` or `DirectorySearcher` if you want more efficient functionality.

```js
import {searchFile, searchDirectory} from 'search-closest'

console.log(await searchFile(['config.json', 'config.yaml']))
// "/path/to/config.json"

console.log(await searchDirectory(['.git']))
// "/path/to/.git"
```

#### `nameOrNames` (searchClosest)

Type: `string[] | string`

The file or directory name or names to find.

#### `options` (searchClosest)

Type: `object`

#### `options.cwd` (searchClosest)

Type: `URL | string`\
Default: `process.cwd()`

The directory start to search.

##### `options.allowSymlinks` (searchClosest)

Type: `boolean`\
Default: `true`

Whether symlinks should be matched.

##### `options.filter` (searchClosest)

Type: `(fileOrDirectory: {name: string, path: string}) => Promise<boolean>`

To exclude specific file or directory.

##### `options.stopDirectory` (searchClosest)

Type: `URL | string`\
Default: Root directory

The last directory to search before stopping.
