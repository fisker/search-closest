import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import test from 'node:test'
import url from 'node:url'
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

// test('main', async () => {
//   // Files
//   assert.equal(await searchClosestFile(fixtures, 'a-file'), getPath('a-file'))
//   assert.equal(await searchClosestFile(fixtures, ['a-file']), getPath('a-file'))
//   assert.equal(await searchClosestFile(fixtures, ['non-exits-file']), undefined)

//   // Directories
//   assert.equal(
//     await searchClosestDirectory(fixtures, 'a-directory'),
//     getPath('a-directory'),
//   )
//   assert.equal(
//     await searchClosestDirectory(fixtures, ['a-directory']),
//     getPath('a-directory'),
//   )
//   assert.equal(
//     await searchClosestDirectory(fixtures, ['non-exits-directory']),
//     undefined,
//   )
// })

// test('Should only match exists files/directories', async () => {
//   // Files
//   assert.equal(
//     await searchClosestFile(fixtures, ['a-file', 'non-exits-file']),
//     getPath('a-file'),
//   )
//   assert.equal(
//     await searchClosestFile(fixtures, ['non-exits-file', 'a-file']),
//     getPath('a-file'),
//   )
//   assert.equal(
//     await searchClosestFile(fixtures, ['non-exits-file', 'a-file'], () => true),
//     getPath('a-file'),
//   )
//   assert.equal(
//     await searchClosestFile(
//       fixtures,
//       ['non-exits-file', 'a-directory', 'a-file'],
//       () => true,
//     ),
//     getPath('a-file'),
//   )

//   // Directories
//   assert.equal(
//     await searchClosestDirectory(fixtures, [
//       'a-directory',
//       'non-exits-directory',
//     ]),
//     getPath('a-directory'),
//   )
//   assert.equal(
//     await searchClosestDirectory(fixtures, [
//       'non-exits-directory',
//       'a-directory',
//     ]),
//     getPath('a-directory'),
//   )
//   assert.equal(
//     await searchClosestDirectory(
//       fixtures,
//       ['non-exits-directory', 'a-directory'],
//       () => true,
//     ),
//     getPath('a-directory'),
//   )
//   assert.equal(
//     await searchClosestDirectory(
//       fixtures,
//       ['non-exits-directory', 'a-file', 'a-directory'],
//       () => true,
//     ),
//     getPath('a-directory'),
//   )
// })

// test('Order matters', async () => {
//   // Files
//   assert.equal(
//     await searchClosestFile(fixtures, ['a-file', 'b-file']),
//     getPath('a-file'),
//   )
//   assert.equal(
//     await searchClosestFile(fixtures, ['b-file', 'a-file']),
//     getPath('b-file'),
//   )

//   // Directories
//   assert.equal(
//     await searchClosestDirectory(fixtures, ['a-directory', 'b-directory']),
//     getPath('a-directory'),
//   )
//   assert.equal(
//     await searchClosestDirectory(fixtures, ['b-directory', 'a-directory']),
//     getPath('b-directory'),
//   )
// })

// test('Predicate', async () => {
//   // Files
//   assert.equal(
//     await searchClosestFile(fixtures, ['b-file', 'a-file'], {
//       filter: ({name}) => name === 'a-file',
//     }),
//     getPath('a-file'),
//   )

//   // Directories
//   assert.equal(
//     await searchClosestDirectory(fixtures, ['b-directory', 'a-directory'], {
//       filter: ({name}) => name === 'a-directory',
//     }),
//     getPath('a-directory'),
//   )
// })

const testSymlink = supportSymlink ? test : test.skip
testSymlink('Options', async () => {
  // Files
  assert.equal(
    await searchClosestFile(fixtures, ['link-to-a-file'], {
      allowSymlinks: true,
    }),
    getPath('link-to-a-file'),
  )
  assert.equal(
    await searchClosestFile(fixtures, ['link-to-a-file'], {
      allowSymlinks: false,
    }),
    undefined,
  )
  assert.equal(
    await searchClosestFile(fixtures, ['link-to-a-file'], {
      filter: () => true,
      allowSymlinks: true,
    }),
    getPath('link-to-a-file'),
  )
  assert.equal(
    await searchClosestFile(fixtures, ['link-to-a-file'], {
      filter: () => true,
      allowSymlinks: false,
    }),
    undefined,
  )
  assert.equal(
    await searchClosestFile(fixtures, ['link-to-a-file'], {
      allowSymlinks: true,
    }),
    getPath('link-to-a-file'),
  )
  assert.equal(
    await searchClosestFile(fixtures, ['link-to-a-file'], {
      allowSymlinks: false,
    }),
    undefined,
  )

  // Directories
  assert.equal(
    await searchClosestDirectory(fixtures, ['link-to-a-directory'], {
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  assert.equal(
    await searchClosestDirectory(fixtures, ['link-to-a-directory'], {
      allowSymlinks: false,
    }),
    undefined,
  )
  assert.equal(
    await searchClosestDirectory(fixtures, ['link-to-a-directory'], {
      filter: () => true,
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  assert.equal(
    await searchClosestDirectory(fixtures, ['link-to-a-directory'], {
      filter: () => true,
      allowSymlinks: false,
    }),
    undefined,
  )
  assert.equal(
    await searchClosestDirectory(fixtures, ['link-to-a-directory'], {
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  assert.equal(
    await searchClosestDirectory(fixtures, ['link-to-a-directory'], {
      allowSymlinks: false,
    }),
    undefined,
  )
})

test('Should accept url, absolute path, or relative path', async () => {
  // Files
  assert.equal(
    await searchClosestFile(fixtures.href, 'a-file'),
    getPath('a-file'),
  )
  assert.equal(
    await searchClosestFile(url.fileURLToPath(fixtures), 'a-file'),
    getPath('a-file'),
  )
  assert.equal(
    await searchClosestFile('./fixtures/', 'a-file'),
    getPath('a-file'),
  )

  // Directories
  assert.equal(
    await searchClosestDirectory(fixtures.href, 'a-directory'),
    getPath('a-directory'),
  )
  assert.equal(
    await searchClosestDirectory(url.fileURLToPath(fixtures), 'a-directory'),
    getPath('a-directory'),
  )
  assert.equal(
    await searchClosestDirectory('./fixtures/', 'a-directory'),
    getPath('a-directory'),
  )
})

test('Should work for deep names too', async () => {
  // Files
  assert.equal(
    await searchClosestFile(new URL('../', fixtures.href), 'fixtures/a-file'),
    getPath('a-file'),
  )

  // Directories
  assert.equal(
    await searchClosestDirectory(
      new URL('../', fixtures.href),
      'fixtures/a-directory',
    ),
    getPath('a-directory'),
  )
})
