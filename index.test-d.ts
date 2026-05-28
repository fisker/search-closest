import * as url from 'node:url'
import {expectType} from 'tsd'
import {
  FileSearcher,
  DirectorySearcher,
  Searcher as AnySearcher,
  searchClosestFile,
  searchClosestDirectory,
  searchClosest,
} from './index.js'

/* `{File,Directory,}Searcher` and `DirectorySearcher` */
for (const Searcher of [FileSearcher, DirectorySearcher, AnySearcher]) {
  const searcher = new Searcher('name')

  // `NameOrNames`
  expectType<string | void>(await new Searcher('name').search())
  expectType<string | void>(await new Searcher(['a', 'b']).search())

  // `options`
  expectType<string | void>(await new Searcher('name', {}).search())

  // `options.allowSymlinks`
  expectType<string | void>(
    await new Searcher('name', {allowSymlinks: true}).search(),
  )

  // `options.filter`
  expectType<string | void>(
    await new Searcher('name', {filter: () => true}).search(),
  )
  expectType<string | void>(
    await new Searcher('name', {
      filter: () => Promise.resolve(true),
    }).search(),
  )

  // `options.stopDirectory`
  expectType<string | void>(
    await new Searcher('name', {stopDirectory: '/path/to/directory/'}).search(),
  )
  expectType<string | void>(
    await new Searcher('name', {
      stopDirectory: url.pathToFileURL('/path/to/directory/'),
    }).search(),
  )
  expectType<string | void>(
    await new Searcher('name', {
      stopDirectory: url.pathToFileURL('/path/to/directory/').href,
    }).search(),
  )
  expectType<string | void>(await new Searcher('name', {cache: true}).search())

  // `{File,Directory,}Searcher#search()`
  expectType<string | void>(await searcher.search())

  // `startDirectory`
  expectType<string | void>(await searcher.search('/path/to/directory/'))
  expectType<string | void>(await searcher.search('/path/to/directory/'))
  expectType<string | void>(
    await searcher.search(url.pathToFileURL('/path/to/directory/')),
  )
  expectType<string | void>(
    await searcher.search(url.pathToFileURL('/path/to/directory/').href),
  )

  // `options`
  expectType<string | void>(
    await searcher.search('/path/to/directory/', {cache: false}),
  )

  // `{File,Directory,}Searcher#clearCache()`
  expectType<void>(searcher.clearCache())
}

/* `searchClosest{File,Directory,}`*/

for (const search of [
  searchClosestFile,
  searchClosestDirectory,
  searchClosest,
]) {
  // `nameOrNames`
  expectType<string | void>(await search('name'))
  expectType<string | void>(await search(['a', 'b']))

  // `options`
  expectType<string | void>(await search('name', {}))

  // `options.allowSymlinks`
  expectType<string | void>(await search('name', {allowSymlinks: true}))

  // `options.cwd`
  expectType<string | void>(await search('name', {cwd: '/path/to/directory/'}))
  expectType<string | void>(
    await search('name', {
      cwd: url.pathToFileURL('/path/to/directory/'),
    }),
  )
  expectType<string | void>(
    await search('name', {
      cwd: url.pathToFileURL('/path/to/directory/').href,
    }),
  )

  // `options.stopDirectory`
  expectType<string | void>(
    await search('name', {stopDirectory: '/path/to/directory/'}),
  )
  expectType<string | void>(
    await search('name', {
      stopDirectory: url.pathToFileURL('/path/to/directory/'),
    }),
  )
  expectType<string | void>(
    await search('name', {
      stopDirectory: url.pathToFileURL('/path/to/directory/').href,
    }),
  )

  // `options.filter`
  expectType<string | void>(await search('name', {filter: () => true}))
  expectType<string | void>(
    await search('name', {filter: () => Promise.resolve(true)}),
  )
}
