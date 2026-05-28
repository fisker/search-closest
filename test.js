import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import url from 'node:url'
import {
  DirectorySearcher,
  FileSearcher,
  searchClosest,
  searchClosestDirectory,
  searchClosestFile,
} from './index.js'
import createFixtures, {FIXTURES_DIRECTORY} from './scripts/create-fixtures.js'

const {directory: fixtures, supportSymlink} = await createFixtures()
const relativeFixturesPath = path.relative(
  import.meta.dirname,
  url.fileURLToPath(fixtures),
)
const getPath = (path) => url.fileURLToPath(new URL(path, fixtures))

test('main', async () => {
  // Files
  assert.equal(
    await searchClosestFile('a-file', {cwd: fixtures}),
    getPath('a-file'),
  )
  assert.equal(
    await searchClosestFile(['a-file'], {cwd: fixtures}),
    getPath('a-file'),
  )
  assert.equal(
    await searchClosestFile(['non-exits-file'], {cwd: fixtures}),
    undefined,
  )

  // Directories
  assert.equal(
    await searchClosestDirectory('a-directory', {cwd: fixtures}),
    getPath('a-directory'),
  )
  assert.equal(
    await searchClosestDirectory(['a-directory'], {cwd: fixtures}),
    getPath('a-directory'),
  )
  assert.equal(
    await searchClosestDirectory(['non-exits-directory'], {cwd: fixtures}),
    undefined,
  )

  // Any
  assert.equal(
    await searchClosest('a-file', {cwd: fixtures}),
    getPath('a-file'),
  )
  assert.equal(
    await searchClosest(['a-directory'], {cwd: fixtures}),
    getPath('a-directory'),
  )
  assert.equal(
    await searchClosest(
      ['a-directory', 'a-file'],
      ({stats}) => stats.isDirectory(),
      {cwd: fixtures},
    ),
    getPath('a-directory'),
  )
  assert.equal(
    await searchClosest(
      ['a-directory', 'a-file'],
      ({stats}) => stats.isFile(),
      {cwd: fixtures},
    ),
    getPath('a-file'),
  )
  assert.equal(
    await searchClosest(['non-exits-directory'], {cwd: fixtures}),
    undefined,
  )

  // Object type
  assert.equal(
    await searchClosest(
      [
        {name: 'a-directory', type: 'directory'},
        {name: 'a-file', type: 'file'},
      ],
      {cwd: fixtures},
    ),
    getPath('a-directory'),
  )
  assert.equal(
    await searchClosest(
      [{name: 'a-directory'}, {name: 'a-file', type: 'file'}],
      {cwd: fixtures},
    ),
    getPath('a-directory'),
  )
  assert.equal(
    await searchClosest(
      [
        {name: 'a-directory', type: 'file'},
        {name: 'a-file', type: 'file'},
      ],
      {cwd: fixtures},
    ),
    getPath('a-file'),
  )
})

test('Should only match exists files/directories', async () => {
  // Files
  assert.equal(
    await searchClosestFile(['a-file', 'non-exits-file'], {cwd: fixtures}),
    getPath('a-file'),
  )
  assert.equal(
    await searchClosestFile(['non-exits-file', 'a-file'], {cwd: fixtures}),
    getPath('a-file'),
  )
  assert.equal(
    await searchClosestFile(['non-exits-file', 'a-file'], {
      cwd: fixtures,
      filter: () => true,
    }),
    getPath('a-file'),
  )
  assert.equal(
    await searchClosestFile(['non-exits-file', 'a-directory', 'a-file'], {
      cwd: fixtures,
      filter: () => true,
    }),
    getPath('a-file'),
  )

  // Directories
  assert.equal(
    await searchClosestDirectory(['a-directory', 'non-exits-directory'], {
      cwd: fixtures,
    }),
    getPath('a-directory'),
  )
  assert.equal(
    await searchClosestDirectory(['non-exits-directory', 'a-directory'], {
      cwd: fixtures,
    }),
    getPath('a-directory'),
  )
  assert.equal(
    await searchClosestDirectory(['non-exits-directory', 'a-directory'], {
      cwd: fixtures,
      filter: () => true,
    }),
    getPath('a-directory'),
  )
  assert.equal(
    await searchClosestDirectory(
      ['non-exits-directory', 'a-file', 'a-directory'],
      {
        cwd: fixtures,
        filter: () => true,
      },
    ),
    getPath('a-directory'),
  )
})

test('Order matters', async () => {
  // Files
  assert.equal(
    await searchClosestFile(['a-file', 'b-file'], {
      cwd: fixtures,
    }),
    getPath('a-file'),
  )
  assert.equal(
    await searchClosestFile(['b-file', 'a-file'], {
      cwd: fixtures,
    }),
    getPath('b-file'),
  )

  // Directories
  assert.equal(
    await searchClosestDirectory(['a-directory', 'b-directory'], {
      cwd: fixtures,
    }),
    getPath('a-directory'),
  )
  assert.equal(
    await searchClosestDirectory(['b-directory', 'a-directory'], {
      cwd: fixtures,
    }),
    getPath('b-directory'),
  )
})

test('Predicate', async () => {
  // Files
  assert.equal(
    await searchClosestFile(['b-file', 'a-file'], {
      cwd: fixtures,
      filter: ({name}) => name === 'a-file',
    }),
    getPath('a-file'),
  )

  // Directories
  assert.equal(
    await searchClosestDirectory(['b-directory', 'a-directory'], {
      cwd: fixtures,
      filter: ({name}) => name === 'a-directory',
    }),
    getPath('a-directory'),
  )
})

const testSymlink = supportSymlink ? test : test.skip
testSymlink('Options', async () => {
  // Files
  assert.equal(
    await searchClosestFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-file'),
  )
  assert.equal(
    await searchClosestFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )
  assert.equal(
    await searchClosestFile(['link-to-a-file'], {
      cwd: fixtures,
      filter: () => true,
      allowSymlinks: true,
    }),
    getPath('link-to-a-file'),
  )
  assert.equal(
    await searchClosestFile(['link-to-a-file'], {
      cwd: fixtures,
      filter: () => true,
      allowSymlinks: false,
    }),
    undefined,
  )
  assert.equal(
    await searchClosestFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-file'),
  )
  assert.equal(
    await searchClosestFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )

  // Directories
  assert.equal(
    await searchClosestDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  assert.equal(
    await searchClosestDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )
  assert.equal(
    await searchClosestDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      filter: () => true,
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  assert.equal(
    await searchClosestDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      filter: () => true,
      allowSymlinks: false,
    }),
    undefined,
  )
  assert.equal(
    await searchClosestDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  assert.equal(
    await searchClosestDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )
})

test('Should accept url, absolute path, or relative path', async () => {
  // Files
  assert.equal(
    await searchClosestFile('a-file', {cwd: fixtures.href}),
    getPath('a-file'),
  )
  assert.equal(
    await searchClosestFile('a-file', {cwd: url.fileURLToPath(fixtures)}),
    getPath('a-file'),
  )
  assert.equal(
    await searchClosestFile('a-file', {cwd: relativeFixturesPath}),
    getPath('a-file'),
  )

  // Directories
  assert.equal(
    await searchClosestDirectory('a-directory', {cwd: fixtures.href}),
    getPath('a-directory'),
  )
  assert.equal(
    await searchClosestDirectory('a-directory', {
      cwd: url.fileURLToPath(fixtures),
    }),
    getPath('a-directory'),
  )
  assert.equal(
    await searchClosestDirectory('a-directory', {cwd: relativeFixturesPath}),
    getPath('a-directory'),
  )
})

test('Should work for deep names too', async () => {
  // Files
  assert.equal(
    await searchClosestFile('a-directory/file-in-a-directory', {cwd: fixtures}),
    getPath('a-directory/file-in-a-directory'),
  )

  // Directories
  assert.equal(
    await searchClosestDirectory('a-directory/directory-in-a-directory', {
      cwd: fixtures,
    }),
    getPath('a-directory/directory-in-a-directory'),
  )
})

test('Searcher', async () => {
  const fileSearcher = new FileSearcher('file-in-root')
  const directorySearcher = new DirectorySearcher('directory-in-root')

  assert.equal(
    await fileSearcher.search(fixtures, {cache: false}),
    url.fileURLToPath(new URL('./file-in-root', FIXTURES_DIRECTORY)),
  )

  assert.equal(
    await directorySearcher.search(fixtures),
    url.fileURLToPath(new URL('./directory-in-root', FIXTURES_DIRECTORY)),
  )

  assert.equal(fileSearcher.clearCache(), undefined)
  assert.equal(directorySearcher.clearCache(), undefined)
})
