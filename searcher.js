import {findDirectory, findFile} from 'find-in-directory'
import iterateDirectoryUp from 'iterate-directory-up'

/**
@import {NameOrNames, Predicate, findDirectory, findFile} from 'find-in-directory'
*/

class Searcher {
  #stopDirectory
  #searchInDirectory
  #cache = new Map()

  /**
  @param {{
    nameOrNames: NameOrNames,
    allowSymlinks: boolean,
    filter: Predicate,
    stopDirectory?: string,
    searchInDirectory: typeof findFile | typeof findDirectory,
  }} param0
  */
  constructor({
    nameOrNames,
    allowSymlinks,
    filter,
    stopDirectory,
    searchInDirectory,
  }) {
    this.#stopDirectory = stopDirectory
    this.#searchInDirectory = (directory) =>
      searchInDirectory(directory, nameOrNames, filter, {allowSymlinks})
  }

  #search(directory, shouldCache) {
    const cache = this.#cache

    // Always cache the result, so we can use it when `shouldCache` is set to `true`
    if (!shouldCache || !cache.has(directory)) {
      cache.set(directory, this.#searchInDirectory(directory))
    }

    return cache.get(directory)
  }

  async search(startDirectory, {shouldCache}) {
    for (const directory of iterateDirectoryUp(
      startDirectory,
      this.#stopDirectory,
    )) {
      // eslint-disable-next-line no-await-in-loop
      const result = await this.#search(directory, shouldCache)

      if (result) {
        return result
      }
    }
  }

  clearCache() {
    this.#cache.clear()
  }
}

// Subclass for better tree-shaking

class FileSearcher extends Searcher {
  constructor(options) {
    super({...options, searchInDirectory: findFile})
  }
}

class DirectorySearcher extends Searcher {
  constructor(options) {
    super({...options, searchInDirectory: findDirectory})
  }
}

export {DirectorySearcher, FileSearcher}
