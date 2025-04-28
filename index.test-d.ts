import * as url from 'node:url'
import {expectType} from 'tsd'
import {
  FileSearcher,
  DirectorySearcher,
  searchClosestFile,
  searchClosestDirectory,
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

/* `searchClosestFile` and `searchClosestDirectory` */

// `nameOrNames`
expectType<string | void>(await searchClosestFile('name'))
expectType<string | void>(await searchClosestDirectory('name'))
expectType<string | void>(await searchClosestFile(['a', 'b']))
expectType<string | void>(await searchClosestDirectory(['a', 'b']))

// `options`
expectType<string | void>(await searchClosestFile('name', {}))
expectType<string | void>(await searchClosestDirectory('name', {}))

// `options.allowSymlinks`
expectType<string | void>(
  await searchClosestFile('name', {allowSymlinks: true}),
)
expectType<string | void>(
  await searchClosestDirectory('name', {allowSymlinks: true}),
)

// `options.cwd`
expectType<string | void>(
  await searchClosestFile('name', {cwd: '/path/to/directory/'}),
)
expectType<string | void>(
  await searchClosestDirectory('name', {cwd: '/path/to/directory/'}),
)
expectType<string | void>(
  await searchClosestFile('name', {
    cwd: url.pathToFileURL('/path/to/directory/'),
  }),
)
expectType<string | void>(
  await searchClosestDirectory('name', {
    cwd: url.pathToFileURL('/path/to/directory/'),
  }),
)
expectType<string | void>(
  await searchClosestFile('name', {
    cwd: url.pathToFileURL('/path/to/directory/').href,
  }),
)
expectType<string | void>(
  await searchClosestDirectory('name', {
    cwd: url.pathToFileURL('/path/to/directory/').href,
  }),
)

// `options.stopDirectory`
expectType<string | void>(
  await searchClosestFile('name', {stopDirectory: '/path/to/directory/'}),
)
expectType<string | void>(
  await searchClosestDirectory('name', {stopDirectory: '/path/to/directory/'}),
)
expectType<string | void>(
  await searchClosestFile('name', {
    stopDirectory: url.pathToFileURL('/path/to/directory/'),
  }),
)
expectType<string | void>(
  await searchClosestDirectory('name', {
    stopDirectory: url.pathToFileURL('/path/to/directory/'),
  }),
)
expectType<string | void>(
  await searchClosestFile('name', {
    stopDirectory: url.pathToFileURL('/path/to/directory/').href,
  }),
)
expectType<string | void>(
  await searchClosestDirectory('name', {
    stopDirectory: url.pathToFileURL('/path/to/directory/').href,
  }),
)

// `options.filter`
expectType<string | void>(await searchClosestFile('name', {filter: () => true}))
expectType<string | void>(
  await searchClosestDirectory('name', {filter: () => true}),
)
expectType<string | void>(
  await searchClosestFile('name', {filter: () => Promise.resolve(true)}),
)
expectType<string | void>(
  await searchClosestDirectory('name', {filter: () => Promise.resolve(true)}),
)
