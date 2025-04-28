import process from 'node:process'
import {findDirectory, findFile} from 'find-in-directory'
import iterateDirectoryUp from 'iterate-directory-up'
import {toAbsolutePath} from 'url-or-path'

/**
@import * as findInDirectory from 'find-in-directory'
@import {UrlOrPath} from 'url-or-path'

@typedef {{
  allowSymlinks?: boolean,
  filter?: findInDirectory.Predicate,
  stopDirectory?: string,
  cache?: boolean,
}} SearcherOptions

@typedef {{
  cache?: boolean,
}} SearchOptions

@typedef {
  SearcherOptions & {
    searchInDirectory: typeof findInDirectory.findFile | typeof findInDirectory.findDirectory
  }
} GenericSearcherOptions

@typedef {
  Omit<SearcherOptions, 'cache'> & {
    cwd?: UrlOrPath,
  }
} SearchClosestOptions
*/

class Searcher {
  #stopDirectory
  #cache
  #resultCache = new Map()
  #searchInDirectory

  /**
  @param {findInDirectory.NameOrNames} nameOrNames
  @param {GenericSearcherOptions} options
  */
  constructor(
    nameOrNames,
    {allowSymlinks, filter, stopDirectory, searchInDirectory, cache},
  ) {
    this.#stopDirectory = stopDirectory
      ? toAbsolutePath(stopDirectory)
      : undefined
    this.#cache = cache ?? true
    this.#searchInDirectory = (directory) =>
      searchInDirectory(directory, nameOrNames, filter, {allowSymlinks})
  }

  #search(directory, cache = true) {
    const resultCache = this.#resultCache

    // Always cache the result, so we can use it when `shouldCache` is set to `true`
    if (!cache || !resultCache.has(directory)) {
      resultCache.set(directory, this.#searchInDirectory(directory))
    }

    return resultCache.get(directory)
  }

  /**
  Find closest file or directory matches name or names.

  @param {UrlOrPath} [startDirectory]
  @param {SearchOptions} [options]
  @returns {Promise<string | void>}
  */
  async search(startDirectory, options) {
    startDirectory ??= startDirectory
      ? toAbsolutePath(startDirectory)
      : process.cwd()
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
  /**
  @param {findInDirectory.NameOrNames} nameOrNames
  @param {SearcherOptions} [options]
  */
  constructor(nameOrNames, options) {
    super(nameOrNames, {...options, searchInDirectory: findFile})
  }
}

/**
@property {any} search
*/
class DirectorySearcher extends Searcher {
  /**
  @param {findInDirectory.NameOrNames} nameOrNames
  @param {SearcherOptions} [options]
  */
  constructor(nameOrNames, options) {
    super(nameOrNames, {...options, searchInDirectory: findDirectory})
  }
}

/**
@param {findInDirectory.NameOrNames} nameOrNames
@param {SearchClosestOptions & {
  Searcher: typeof FileSearcher | typeof DirectorySearcher
}} options
*/
function searchClosest(nameOrNames, options) {
  return new options.Searcher(nameOrNames, {
    allowSymlinks: options.allowSymlinks,
    filter: options.filter,
    stopDirectory: options.stopDirectory,
    cache: false,
  }).search(options.cwd)
}

/**
@param {findInDirectory.NameOrNames} nameOrNames
@param {SearchClosestOptions} [options]
@returns {ReturnType<FileSearcher['search']>}
*/
function searchClosestFile(nameOrNames, options) {
  return searchClosest(nameOrNames, {...options, Searcher: FileSearcher})
}

/**
@param {findInDirectory.NameOrNames} nameOrNames
@param {SearchClosestOptions} [options]
@returns {ReturnType<DirectorySearcher['search']>}
*/
function searchClosestDirectory(nameOrNames, options) {
  return searchClosest(nameOrNames, {...options, Searcher: DirectorySearcher})
}

export {
  DirectorySearcher,
  FileSearcher,
  searchClosestDirectory,
  searchClosestFile,
}
