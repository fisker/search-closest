import * as url from 'node:url'
import {expectType} from 'tsd'
import {
  FileSearcher,
  DirectorySearcher,
  searchFile,
  searchDirectory,
} from './index.js'

/* `FileSearcher` and `DirectorySearcher` */
const fileSearcher = new FileSearcher('name')
const directorySearcher = new DirectorySearcher('name')

// `NameOrNames`
expectType<string | void>(await new FileSearcher('name').search())
expectType<string | void>(await new DirectorySearcher('name').search())
expectType<string | void>(await new FileSearcher(['a', 'b']).search())
expectType<string | void>(await new DirectorySearcher(['a', 'b']).search())

// `options`
expectType<string | void>(await new FileSearcher('name', {}).search())
expectType<string | void>(await new DirectorySearcher('name', {}).search())

// `options.allowSymlinks`
expectType<string | void>(
  await new FileSearcher('name', {allowSymlinks: true}).search(),
)
expectType<string | void>(
  await new DirectorySearcher('name', {allowSymlinks: true}).search(),
)

// `options.filter`
expectType<string | void>(
  await new FileSearcher('name', {filter: () => true}).search(),
)
expectType<string | void>(
  await new DirectorySearcher('name', {filter: () => true}).search(),
)
expectType<string | void>(
  await new FileSearcher('name', {
    filter: () => Promise.resolve(true),
  }).search(),
)
expectType<string | void>(
  await new DirectorySearcher('name', {
    filter: () => Promise.resolve(true),
  }).search(),
)
expectType<string | void>(
  await new FileSearcher('name', {
    filter: () => Promise.resolve(true),
  }).search(),
)

// `options.stopDirectory`
expectType<string | void>(
  await new FileSearcher('name', {
    stopDirectory: '/path/to/directory/',
  }).search(),
)
expectType<string | void>(
  await new DirectorySearcher('name', {
    stopDirectory: '/path/to/directory/',
  }).search(),
)
expectType<string | void>(
  await new FileSearcher('name', {
    stopDirectory: url.pathToFileURL('/path/to/directory/'),
  }).search(),
)
expectType<string | void>(
  await new DirectorySearcher('name', {
    stopDirectory: url.pathToFileURL('/path/to/directory/'),
  }).search(),
)
expectType<string | void>(
  await new FileSearcher('name', {
    stopDirectory: url.pathToFileURL('/path/to/directory/').href,
  }).search(),
)
expectType<string | void>(
  await new DirectorySearcher('name', {
    stopDirectory: url.pathToFileURL('/path/to/directory/').href,
  }).search(),
)
expectType<string | void>(
  await new FileSearcher('name', {cache: true}).search(),
)
expectType<string | void>(
  await new DirectorySearcher('name', {cache: true}).search(),
)

// `{FileSearcher,DirectorySearcher}#search()`
expectType<string | void>(await fileSearcher.search())
expectType<string | void>(await directorySearcher.search())

// `startDirectory`
expectType<string | void>(await fileSearcher.search('/path/to/directory/'))
expectType<string | void>(await directorySearcher.search('/path/to/directory/'))
expectType<string | void>(
  await fileSearcher.search(url.pathToFileURL('/path/to/directory/')),
)
expectType<string | void>(
  await directorySearcher.search(url.pathToFileURL('/path/to/directory/')),
)
expectType<string | void>(
  await fileSearcher.search(url.pathToFileURL('/path/to/directory/').href),
)
expectType<string | void>(
  await directorySearcher.search(url.pathToFileURL('/path/to/directory/').href),
)

// `options`
expectType<string | void>(
  await fileSearcher.search('/path/to/directory/', {cache: false}),
)
expectType<string | void>(
  await directorySearcher.search('/path/to/directory/', {
    cache: false,
  }),
)

// `{FileSearcher,DirectorySearcher}#clearCache()`
expectType<void>(fileSearcher.clearCache())
expectType<void>(directorySearcher.clearCache())

/* `searchFile` and `searchDirectory` */

// `nameOrNames`
expectType<string | void>(await searchFile('name'))
expectType<string | void>(await searchDirectory('name'))
expectType<string | void>(await searchFile(['a', 'b']))
expectType<string | void>(await searchDirectory(['a', 'b']))

// `options`
expectType<string | void>(await searchFile('name', {}))
expectType<string | void>(await searchDirectory('name', {}))

// `options.allowSymlinks`
expectType<string | void>(await searchFile('name', {allowSymlinks: true}))
expectType<string | void>(await searchDirectory('name', {allowSymlinks: true}))

// `options.cwd`
expectType<string | void>(
  await searchFile('name', {cwd: '/path/to/directory/'}),
)
expectType<string | void>(
  await searchDirectory('name', {cwd: '/path/to/directory/'}),
)
expectType<string | void>(
  await searchFile('name', {
    cwd: url.pathToFileURL('/path/to/directory/'),
  }),
)
expectType<string | void>(
  await searchDirectory('name', {
    cwd: url.pathToFileURL('/path/to/directory/'),
  }),
)
expectType<string | void>(
  await searchFile('name', {
    cwd: url.pathToFileURL('/path/to/directory/').href,
  }),
)
expectType<string | void>(
  await searchDirectory('name', {
    cwd: url.pathToFileURL('/path/to/directory/').href,
  }),
)

// `options.stopDirectory`
expectType<string | void>(
  await searchFile('name', {stopDirectory: '/path/to/directory/'}),
)
expectType<string | void>(
  await searchDirectory('name', {stopDirectory: '/path/to/directory/'}),
)
expectType<string | void>(
  await searchFile('name', {
    stopDirectory: url.pathToFileURL('/path/to/directory/'),
  }),
)
expectType<string | void>(
  await searchDirectory('name', {
    stopDirectory: url.pathToFileURL('/path/to/directory/'),
  }),
)
expectType<string | void>(
  await searchFile('name', {
    stopDirectory: url.pathToFileURL('/path/to/directory/').href,
  }),
)
expectType<string | void>(
  await searchDirectory('name', {
    stopDirectory: url.pathToFileURL('/path/to/directory/').href,
  }),
)

// `options.filter`
expectType<string | void>(await searchFile('name', {filter: () => true}))
expectType<string | void>(await searchDirectory('name', {filter: () => true}))
expectType<string | void>(
  await searchFile('name', {filter: () => Promise.resolve(true)}),
)
expectType<string | void>(
  await searchDirectory('name', {filter: () => Promise.resolve(true)}),
)
