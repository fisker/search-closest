import iterateDirectoryUp from 'iterate-directory-up'

/**
@import {
  findFile,
  findDirectory,
  findInDirectory,
  FileOrDirectoryFindOptions as FindOptions,
} from 'find-in-directory'
@import {NameOrNames} from 'find-in-directory/find.js'

@typedef {Parameters<typeof iterateDirectoryUp>[1]} OptionalUrlOrPath

@typedef {{
  allowSymlinks?: FindOptions['allowSymlinks'],
  filter?: FindOptions['filter'],
  stopDirectory?: OptionalUrlOrPath,
  cache?: boolean,
}} SearcherOptions

@typedef {{
  cache?: boolean,
}} SearchOptions

@typedef {Promise<string | void>} SearchResult
*/

class Searcher {
  #stopDirectory
  #cache
  #resultCache = new Map()
  #searchWithoutCache
  /**
  @protected
  @type {typeof findFile | typeof findDirectory | typeof findInDirectory | undefined}
  */
  findInDirectory

  /**
  @param {NameOrNames} nameOrNames
  @param {SearcherOptions} [options]
  */
  constructor(nameOrNames, {allowSymlinks, filter, stopDirectory, cache} = {}) {
    this.#stopDirectory = stopDirectory
    this.#cache = cache ?? true
    /**
    @param {string} directory
    */
    this.#searchWithoutCache = (directory) =>
      // @ts-expect-error
      this.findInDirectory(nameOrNames, {cwd: directory, filter, allowSymlinks})
  }

  /**
    @param {string} directory
    */
  #search(directory, cache = true) {
    const resultCache = this.#resultCache

    // Always cache the result, so we can use it when `shouldCache` is set to `true`
    if (!cache || !resultCache.has(directory)) {
      resultCache.set(directory, this.#searchWithoutCache(directory))
    }

    return resultCache.get(directory)
  }

  /**
  Find closest file or directory matches name or names.

  @param {OptionalUrlOrPath} [startDirectory]
  @param {SearchOptions} [options]
  @returns {SearchResult}
  */
  async search(startDirectory, options) {
    for (const directory of iterateDirectoryUp(
      startDirectory,
      this.#stopDirectory,
    )) {
      const result = await this.#search(
        directory,
        options?.cache ?? this.#cache,
      )

      if (result) {
        return result
      }
    }
  }

  /**
  Clear caches.

  @returns {void}
  */
  clearCache() {
    this.#resultCache.clear()
  }
}

export {Searcher}
