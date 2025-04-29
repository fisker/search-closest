import fs from 'node:fs/promises'
import os from 'node:os'

const IS_WINDOWS = os.platform() === 'win32'

const FIXTURES_DIRECTORY = new URL('../fixtures/', import.meta.url)

const createFile = (file) => fs.writeFile(file, file.href)
const createDirectory = (directory) => fs.mkdir(directory, {recursive: true})
const createFileSymlink = (target, url) => fs.symlink(target, url)
const createDirectorySymlink = (target, url) =>
  fs.symlink(target, url, IS_WINDOWS ? 'junction' : undefined)

async function createFixtures(depth = 3) {
  await fs.rm(FIXTURES_DIRECTORY, {recursive: true, force: true})

  const directory = new URL(
    Array.from({length: depth}, (_, index) => `level-${index + 1}`).join('/') +
      '/',
    FIXTURES_DIRECTORY,
  )

  await createDirectory(directory)

  // Two files
  const fileA = new URL('./a-file', directory)
  const fileB = new URL('./b-file', directory)

  await Promise.all([fileA, fileB].map((file) => createFile(file)))

  // Two directories
  const directoryA = new URL('./a-directory/', directory)
  const directoryB = new URL('./b-directory/', directory)
  await Promise.all(
    [directoryA, directoryB].map((directory) => createDirectory(directory)),
  )

  // File and directory in `a-directory`
  await Promise.all([
    createFile(new URL('./file', directoryA)),
    createDirectory(new URL('./directory', directoryA)),
  ])

  // Symbolic link to file and directory
  const linkToFile = new URL('./link-to-a-file', directory)
  const linkToDirectory = new URL('./link-to-a-directory', directory)

  let supportSymlink = !IS_WINDOWS
  try {
    await Promise.all([
      createFileSymlink(fileA, linkToFile),
      createDirectorySymlink(directoryA, linkToDirectory),
    ])
  } catch (error) {
    if (!IS_WINDOWS) {
      throw error
    }
  }

  if (IS_WINDOWS) {
    try {
      const state = await fs.lstat(linkToDirectory)
      supportSymlink = state.isSymbolicLink()
    } catch {
      supportSymlink = false
    }

    if (!supportSymlink) {
      console.warn(
        "'symbolic links' tests can not run on this machine, active 'Developer Mode' may help.\nSee https://learn.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development#activate-developer-mode",
      )
    }
  }

  return {supportSymlink, directory}
}

export default createFixtures
