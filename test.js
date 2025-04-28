import fs from 'node:fs/promises'
import os from 'node:os'
import url from 'node:url'
import test from 'ava'
import {searchClosestDirectory, searchClosestFile} from './index.js'

const fixtures = new URL('./fixtures/', import.meta.url)
const getPath = (path) => url.fileURLToPath(new URL(path, fixtures))

await Promise.allSettled([
  fs.unlink(new URL('./link-to-a-file', fixtures)),
  fs.unlink(new URL('./link-to-a-directory', fixtures)),
])

let supportSymlink = true
try {
  await Promise.all([
    fs.symlink(
      new URL('./a-file', fixtures),
      new URL('./link-to-a-file', fixtures),
    ),
    fs.symlink(
      new URL('./a-directory', fixtures),
      new URL('./link-to-a-directory', fixtures),
    ),
  ])
} catch (error) {
  if (
    os.platform === 'win32' &&
    error.code === 'EPERM' &&
    error.syscall === 'symlink'
  ) {
    console.warn(
      "'symbolic links' tests can not run on this machine, active 'Developer Mode' may help.\nSee https://learn.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development#activate-developer-mode",
    )
    supportSymlink = false
  } else {
    throw error
  }
}

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
testSymlink.skip('Options', async (t) => {
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
    await searchClosestFile('a-file', {cwd: './fixtures/'}),
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
    await searchClosestDirectory('a-directory', {cwd: './fixtures/'}),
    getPath('a-directory'),
  )
})

test('Should work for deep names too', async (t) => {
  // Files
  t.is(
    await searchClosestFile('fixtures/a-file', {
      cwd: new URL('../', fixtures.href),
    }),
    getPath('a-file'),
  )

  // Directories
  t.is(
    await searchClosestDirectory('fixtures/a-directory', {
      cwd: new URL('../', fixtures.href),
    }),
    getPath('a-directory'),
  )
})
