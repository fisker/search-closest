import * as url from 'node:url'
import {expectType, expectError} from 'tsd'
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

  // `targets`
  expectType<string | undefined>(await new Searcher('name').search())
  expectType<string | undefined>(await new Searcher(['a', 'b']).search())

  // Object `Target`
  expectType<string | undefined>(await new Searcher({name: 'name'}).search())
  expectType<string | undefined>(
    await new Searcher(['a', {name: 'b'}]).search(),
  )

  // `Target.filter`
  expectType<string | undefined>(
    await new Searcher({name: 'name', filter: () => true}).search(),
  )
  expectType<string | undefined>(
    await new Searcher({
      name: 'name',
      filter: () => Promise.resolve(false),
    }).search(),
  )

  // `options`
  expectType<string | undefined>(await new Searcher('name', {}).search())
  expectType<string | undefined>(await new Searcher('name', undefined).search())
  expectType<string | undefined>(
    await new Searcher('name', () => true).search(),
  )
  expectType<string | undefined>(
    await new Searcher('name', () => true, {}).search(),
  )

  // `options.allowSymlinks`
  expectType<string | undefined>(
    await new Searcher('name', {allowSymlinks: true}).search(),
  )

  // `options.filter`
  expectType<string | undefined>(
    await new Searcher('name', {filter: () => true}).search(),
  )
  expectType<string | undefined>(
    await new Searcher('name', {
      filter: () => Promise.resolve(true),
    }).search(),
  )

  // `options.stopDirectory`
  expectType<string | undefined>(
    await new Searcher('name', {stopDirectory: '/path/to/directory/'}).search(),
  )
  expectType<string | undefined>(
    await new Searcher('name', {
      stopDirectory: url.pathToFileURL('/path/to/directory/'),
    }).search(),
  )
  expectType<string | undefined>(
    await new Searcher('name', {
      stopDirectory: url.pathToFileURL('/path/to/directory/').href,
    }).search(),
  )
  expectType<string | undefined>(
    await new Searcher('name', {cache: true}).search(),
  )

  // `{File,Directory,}Searcher#search()`
  expectType<string | undefined>(await searcher.search())

  // `startDirectory`
  expectType<string | undefined>(await searcher.search('/path/to/directory/'))
  expectType<string | undefined>(await searcher.search('/path/to/directory/'))
  expectType<string | undefined>(
    await searcher.search(url.pathToFileURL('/path/to/directory/')),
  )
  expectType<string | undefined>(
    await searcher.search(url.pathToFileURL('/path/to/directory/').href),
  )

  // `options`
  expectType<string | undefined>(
    await searcher.search('/path/to/directory/', {cache: false}),
  )

  // `{File,Directory,}Searcher#clearCache()`
  expectType<void>(searcher.clearCache())
}

// `target.type`
expectType<string | undefined>(
  await new AnySearcher({name: 'name', type: 'file'}).search(),
)
// FIXME: should not allow type here
// expectError(await new FileSearcher({name: 'name', type: 'file'}).search())
// expectError(await new FileSearcher({name: 'name', type: 'directory'}).search())
// expectError(
//   await new DirectorySearcher({name: 'name', type: 'directory'}).search(),
// )

/* `searchClosest{File,Directory,}`*/

for (const search of [
  searchClosestFile,
  searchClosestDirectory,
  searchClosest,
]) {
  // `targets`
  expectType<string | undefined>(await search('name'))
  expectType<string | undefined>(await search(['a', 'b']))

  // Object `Target`
  expectType<string | undefined>(await search({name: 'name'}))
  expectType<string | undefined>(await search(['a', {name: 'b'}]))

  // `Target.filter`
  expectType<string | undefined>(
    await search({name: 'name', filter: () => true}),
  )
  expectType<string | undefined>(
    await search({name: 'name', filter: () => Promise.resolve(false)}),
  )

  // `options`
  expectType<string | undefined>(await search('name', {}))
  expectType<string | undefined>(await search('name', undefined))
  expectType<string | undefined>(await search('name', () => true))
  expectType<string | undefined>(await search('name', () => true, {}))

  // `options.allowSymlinks`
  expectType<string | undefined>(await search('name', {allowSymlinks: true}))

  // `options.cwd`
  expectType<string | undefined>(
    await search('name', {cwd: '/path/to/directory/'}),
  )
  expectType<string | undefined>(
    await search('name', {
      cwd: url.pathToFileURL('/path/to/directory/'),
    }),
  )
  expectType<string | undefined>(
    await search('name', {
      cwd: url.pathToFileURL('/path/to/directory/').href,
    }),
  )

  // `options.stopDirectory`
  expectType<string | undefined>(
    await search('name', {stopDirectory: '/path/to/directory/'}),
  )
  expectType<string | undefined>(
    await search('name', {
      stopDirectory: url.pathToFileURL('/path/to/directory/'),
    }),
  )
  expectType<string | undefined>(
    await search('name', {
      stopDirectory: url.pathToFileURL('/path/to/directory/').href,
    }),
  )

  // `options.filter`
  expectType<string | undefined>(await search('name', {filter: () => true}))
  expectType<string | undefined>(
    await search('name', {filter: () => Promise.resolve(true)}),
  )
}

// `target.type`
expectType<string | undefined>(
  await searchClosest({name: 'name', type: 'file'}),
)
expectError(await searchClosestFile({name: 'name', type: 'file'}))
expectError(await searchClosestFile({name: 'name', type: 'directory'}))
expectError(await searchClosestDirectory({name: 'name', type: 'directory'}))
