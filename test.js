import path from 'node:path'
import url from 'node:url'
import test from 'ava'
import {searchClosestDirectory, searchClosestFile} from './index.js'
import createFixtures from './scripts/create-fixtures.js'

const {directory: fixtures, supportSymlink} = await createFixtures()
const relativeFixturesPath = path.relative(
  import.meta.dirname,
  url.fileURLToPath(fixtures),
)
const getPath = (path) => url.fileURLToPath(new URL(path, fixtures))

test('main', async (t) => {
  // Files
  t.is(await searchClosestFile('a-file', {cwd: fixtures}), getPath('a-file'))
  t.is(await searchClosestFile(['a-file'], {cwd: fixtures}), getPath('a-file'))
  t.is(await searchClosestFile(['non-exits-file'], {cwd: fixtures}), undefined)

  // Directories
  t.is(
    await searchClosestDirectory('a-directory', {cwd: fixtures}),
    getPath('a-directory'),
  )
  t.is(
    await searchClosestDirectory(['a-directory'], {cwd: fixtures}),
    getPath('a-directory'),
  )
  t.is(
    await searchClosestDirectory(['non-exits-directory'], {cwd: fixtures}),
    undefined,
  )
})

test('Should only match exists files/directories', async (t) => {
  // Files
  t.is(
    await searchClosestFile(['a-file', 'non-exits-file'], {cwd: fixtures}),
    getPath('a-file'),
  )
  t.is(
    await searchClosestFile(['non-exits-file', 'a-file'], {cwd: fixtures}),
    getPath('a-file'),
  )
  t.is(
    await searchClosestFile(['non-exits-file', 'a-file'], {
      cwd: fixtures,
      filter: () => true,
    }),
    getPath('a-file'),
  )
  t.is(
    await searchClosestFile(['non-exits-file', 'a-directory', 'a-file'], {
      cwd: fixtures,
      filter: () => true,
    }),
    getPath('a-file'),
  )

  // Directories
  t.is(
    await searchClosestDirectory(['a-directory', 'non-exits-directory'], {
      cwd: fixtures,
    }),
    getPath('a-directory'),
  )
  t.is(
    await searchClosestDirectory(['non-exits-directory', 'a-directory'], {
      cwd: fixtures,
    }),
    getPath('a-directory'),
  )
  t.is(
    await searchClosestDirectory(['non-exits-directory', 'a-directory'], {
      cwd: fixtures,
      filter: () => true,
    }),
    getPath('a-directory'),
  )
  t.is(
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

test('Order matters', async (t) => {
  // Files
  t.is(
    await searchClosestFile(['a-file', 'b-file'], {
      cwd: fixtures,
    }),
    getPath('a-file'),
  )
  t.is(
    await searchClosestFile(['b-file', 'a-file'], {
      cwd: fixtures,
    }),
    getPath('b-file'),
  )

  // Directories
  t.is(
    await searchClosestDirectory(['a-directory', 'b-directory'], {
      cwd: fixtures,
    }),
    getPath('a-directory'),
  )
  t.is(
    await searchClosestDirectory(['b-directory', 'a-directory'], {
      cwd: fixtures,
    }),
    getPath('b-directory'),
  )
})

test('Predicate', async (t) => {
  // Files
  t.is(
    await searchClosestFile(['b-file', 'a-file'], {
      cwd: fixtures,
      filter: ({name}) => name === 'a-file',
    }),
    getPath('a-file'),
  )

  // Directories
  t.is(
    await searchClosestDirectory(['b-directory', 'a-directory'], {
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
    await searchClosestFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-file'),
  )
  t.is(
    await searchClosestFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )
  t.is(
    await searchClosestFile(['link-to-a-file'], {
      cwd: fixtures,
      filter: () => true,
      allowSymlinks: true,
    }),
    getPath('link-to-a-file'),
  )
  t.is(
    await searchClosestFile(['link-to-a-file'], {
      cwd: fixtures,
      filter: () => true,
      allowSymlinks: false,
    }),
    undefined,
  )
  t.is(
    await searchClosestFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-file'),
  )
  t.is(
    await searchClosestFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )

  // Directories
  t.is(
    await searchClosestDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  t.is(
    await searchClosestDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )
  t.is(
    await searchClosestDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      filter: () => true,
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  t.is(
    await searchClosestDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      filter: () => true,
      allowSymlinks: false,
    }),
    undefined,
  )
  t.is(
    await searchClosestDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  t.is(
    await searchClosestDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )
})

test('Should accept url, absolute path, or relative path', async (t) => {
  // Files
  t.is(
    await searchClosestFile('a-file', {cwd: fixtures.href}),
    getPath('a-file'),
  )
  t.is(
    await searchClosestFile('a-file', {cwd: url.fileURLToPath(fixtures)}),
    getPath('a-file'),
  )
  t.is(
    await searchClosestFile('a-file', {cwd: relativeFixturesPath}),
    getPath('a-file'),
  )

  // Directories
  t.is(
    await searchClosestDirectory('a-directory', {cwd: fixtures.href}),
    getPath('a-directory'),
  )
  t.is(
    await searchClosestDirectory('a-directory', {
      cwd: url.fileURLToPath(fixtures),
    }),
    getPath('a-directory'),
  )
  t.is(
    await searchClosestDirectory('a-directory', {cwd: relativeFixturesPath}),
    getPath('a-directory'),
  )
})

test('Should work for deep names too', async (t) => {
  // Files
  t.is(
    await searchClosestFile('a-directory/file', {cwd: fixtures}),
    getPath('a-directory/file'),
  )

  // Directories
  t.is(
    await searchClosestDirectory('a-directory/directory', {cwd: fixtures}),
    getPath('a-directory/directory'),
  )
})
