import path from 'node:path'
import url from 'node:url'
import test from 'ava'
import {
  DirectorySearcher,
  FileSearcher,
  searchDirectory,
  searchFile,
} from './index.js'
import createFixtures, {FIXTURES_DIRECTORY} from './scripts/create-fixtures.js'

const {directory: fixtures, supportSymlink} = await createFixtures()
const relativeFixturesPath = path.relative(
  import.meta.dirname,
  url.fileURLToPath(fixtures),
)
const getPath = (path) => url.fileURLToPath(new URL(path, fixtures))

test('main', async (t) => {
  // Files
  t.is(await searchFile('a-file', {cwd: fixtures}), getPath('a-file'))
  t.is(await searchFile(['a-file'], {cwd: fixtures}), getPath('a-file'))
  t.is(await searchFile(['non-exits-file'], {cwd: fixtures}), undefined)

  // Directories
  t.is(
    await searchDirectory('a-directory', {cwd: fixtures}),
    getPath('a-directory'),
  )
  t.is(
    await searchDirectory(['a-directory'], {cwd: fixtures}),
    getPath('a-directory'),
  )
  t.is(
    await searchDirectory(['non-exits-directory'], {cwd: fixtures}),
    undefined,
  )
})

test('Should only match exists files/directories', async (t) => {
  // Files
  t.is(
    await searchFile(['a-file', 'non-exits-file'], {cwd: fixtures}),
    getPath('a-file'),
  )
  t.is(
    await searchFile(['non-exits-file', 'a-file'], {cwd: fixtures}),
    getPath('a-file'),
  )
  t.is(
    await searchFile(['non-exits-file', 'a-file'], {
      cwd: fixtures,
      filter: () => true,
    }),
    getPath('a-file'),
  )
  t.is(
    await searchFile(['non-exits-file', 'a-directory', 'a-file'], {
      cwd: fixtures,
      filter: () => true,
    }),
    getPath('a-file'),
  )

  // Directories
  t.is(
    await searchDirectory(['a-directory', 'non-exits-directory'], {
      cwd: fixtures,
    }),
    getPath('a-directory'),
  )
  t.is(
    await searchDirectory(['non-exits-directory', 'a-directory'], {
      cwd: fixtures,
    }),
    getPath('a-directory'),
  )
  t.is(
    await searchDirectory(['non-exits-directory', 'a-directory'], {
      cwd: fixtures,
      filter: () => true,
    }),
    getPath('a-directory'),
  )
  t.is(
    await searchDirectory(['non-exits-directory', 'a-file', 'a-directory'], {
      cwd: fixtures,
      filter: () => true,
    }),
    getPath('a-directory'),
  )
})

test('Order matters', async (t) => {
  // Files
  t.is(
    await searchFile(['a-file', 'b-file'], {
      cwd: fixtures,
    }),
    getPath('a-file'),
  )
  t.is(
    await searchFile(['b-file', 'a-file'], {
      cwd: fixtures,
    }),
    getPath('b-file'),
  )

  // Directories
  t.is(
    await searchDirectory(['a-directory', 'b-directory'], {
      cwd: fixtures,
    }),
    getPath('a-directory'),
  )
  t.is(
    await searchDirectory(['b-directory', 'a-directory'], {
      cwd: fixtures,
    }),
    getPath('b-directory'),
  )
})

test('Predicate', async (t) => {
  // Files
  t.is(
    await searchFile(['b-file', 'a-file'], {
      cwd: fixtures,
      filter: ({name}) => name === 'a-file',
    }),
    getPath('a-file'),
  )

  // Directories
  t.is(
    await searchDirectory(['b-directory', 'a-directory'], {
      cwd: fixtures,
      filter: ({name}) => name === 'a-directory',
    }),
    getPath('a-directory'),
  )
})

const testSymlink = supportSymlink ? test : test.skip
testSymlink('Options', async (t) => {
  // Files
  t.is(
    await searchFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-file'),
  )
  t.is(
    await searchFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )
  t.is(
    await searchFile(['link-to-a-file'], {
      cwd: fixtures,
      filter: () => true,
      allowSymlinks: true,
    }),
    getPath('link-to-a-file'),
  )
  t.is(
    await searchFile(['link-to-a-file'], {
      cwd: fixtures,
      filter: () => true,
      allowSymlinks: false,
    }),
    undefined,
  )
  t.is(
    await searchFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-file'),
  )
  t.is(
    await searchFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )

  // Directories
  t.is(
    await searchDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  t.is(
    await searchDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )
  t.is(
    await searchDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      filter: () => true,
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  t.is(
    await searchDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      filter: () => true,
      allowSymlinks: false,
    }),
    undefined,
  )
  t.is(
    await searchDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  t.is(
    await searchDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )
})

test('Should accept url, absolute path, or relative path', async (t) => {
  // Files
  t.is(await searchFile('a-file', {cwd: fixtures.href}), getPath('a-file'))
  t.is(
    await searchFile('a-file', {cwd: url.fileURLToPath(fixtures)}),
    getPath('a-file'),
  )
  t.is(
    await searchFile('a-file', {cwd: relativeFixturesPath}),
    getPath('a-file'),
  )

  // Directories
  t.is(
    await searchDirectory('a-directory', {cwd: fixtures.href}),
    getPath('a-directory'),
  )
  t.is(
    await searchDirectory('a-directory', {
      cwd: url.fileURLToPath(fixtures),
    }),
    getPath('a-directory'),
  )
  t.is(
    await searchDirectory('a-directory', {cwd: relativeFixturesPath}),
    getPath('a-directory'),
  )
})

test('Should work for deep names too', async (t) => {
  // Files
  t.is(
    await searchFile('a-directory/file-in-a-directory', {cwd: fixtures}),
    getPath('a-directory/file-in-a-directory'),
  )

  // Directories
  t.is(
    await searchDirectory('a-directory/directory-in-a-directory', {
      cwd: fixtures,
    }),
    getPath('a-directory/directory-in-a-directory'),
  )
})

test('Searcher', async (t) => {
  const fileSearcher = new FileSearcher('file-in-root')
  const directorySearcher = new DirectorySearcher('directory-in-root')

  t.is(
    await fileSearcher.search(fixtures, {cache: false}),
    url.fileURLToPath(new URL('./file-in-root', FIXTURES_DIRECTORY)),
  )

  t.is(
    await directorySearcher.search(fixtures),
    url.fileURLToPath(new URL('./directory-in-root', FIXTURES_DIRECTORY)),
  )

  t.is(fileSearcher.clearCache(), undefined)
  t.is(directorySearcher.clearCache(), undefined)
})
