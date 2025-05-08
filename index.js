import {findDirectory, findFile} from 'find-in-directory'
import iterateDirectoryUp from 'iterate-directory-up'

/**
@import {NameOrNames, Predicate, FindOptions} from 'find-in-directory'

@typedef {Parameters<typeof iterateDirectoryUp>[1]} OptionalUrlOrPath

@typedef {{
  allowSymlinks?: FindOptions['allowSymlinks'],
  filter?: Predicate,
  stopDirectory?: OptionalUrlOrPath,
  cache?: boolean,
}} SearcherOptions

@typedef {{
  cache?: boolean,
}} SearchOptions

@typedef {
  Omit<SearcherOptions, 'cache'> & {
    cwd?: OptionalUrlOrPath,
  }
} SearchClosestOptions

@typedef {Promise<string | void>} SearchResult
*/

class Searcher {
  #stopDirectory
  #cache
  #resultCache = new Map()
  #searchWithoutCache
  /**
  @protected
  @type {typeof findFile | typeof findDirectory}
  */
  findInDirectory

  /**
  @param {NameOrNames} nameOrNames
  @param {SearcherOptions} [options]
  */
  constructor(nameOrNames, {allowSymlinks, filter, stopDirectory, cache} = {}) {
    this.#stopDirectory = stopDirectory
    this.#cache = cache ?? true
    this.#searchWithoutCache = (directory) =>
      this.findInDirectory(directory, nameOrNames, filter, {allowSymlinks})
  }

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
      // eslint-disable-next-line no-await-in-loop
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

// Subclass for better tree-shaking

class FileSearcher extends Searcher {
  /** @protected */
  findInDirectory = findFile
}

class DirectorySearcher extends Searcher {
  /** @protected */
  findInDirectory = findDirectory
}

/**
@param {NameOrNames} nameOrNames
@param {SearchClosestOptions & {
  Searcher: typeof FileSearcher | typeof DirectorySearcher
}} options
*/
function searchClosest(
  nameOrNames,
  {Searcher, cwd, allowSymlinks, filter, stopDirectory},
) {
  return new Searcher(nameOrNames, {
    allowSymlinks,
    filter,
    stopDirectory,
    cache: false,
  }).search(cwd)
}

/**
@param {NameOrNames} nameOrNames
@param {SearchClosestOptions} [options]
@returns {SearchResult}
*/
function searchFile(nameOrNames, options) {
  return searchClosest(nameOrNames, {...options, Searcher: FileSearcher})
}

/**
@param {NameOrNames} nameOrNames
@param {SearchClosestOptions} [options]
@returns {SearchResult}
*/
function searchDirectory(nameOrNames, options) {
  return searchClosest(nameOrNames, {...options, Searcher: DirectorySearcher})
}

export {DirectorySearcher, FileSearcher, searchDirectory, searchFile}
