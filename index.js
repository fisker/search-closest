import {
  findDirectoryInDirectory,
  findFileInDirectory,
  findInDirectory,
} from 'find-in-directory'
import iterateDirectoryUp from 'iterate-directory-up'

/**
@import {
  FindOptions,
  NameOrNames,
  Filter,
} from 'find-in-directory'

@typedef {Parameters<typeof iterateDirectoryUp>[1]} OptionalUrlOrPath

@typedef {{
  allowSymlinks?: FindOptions['allowSymlinks'],
  filter?: FindOptions['filter'],
  stopDirectory?: OptionalUrlOrPath,
  cache?: boolean,
}} SearcherOptions

@typedef {Filter | SearcherOptions} FilterOrOptions

@typedef {Omit<SearcherOptions, "filter">} OptionsWithoutFilter

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

class SearcherInternal {
  #stopDirectory
  #cache
  #resultCache = new Map()
  #searchWithoutCache
  /**
  @protected
  @type {typeof findFileInDirectory | typeof findDirectoryInDirectory | typeof findInDirectory | undefined}
  */
  findInDirectory

  /**
  @param {NameOrNames} nameOrNames
  @param {FilterOrOptions} [filterOrOptions]
  @param {OptionsWithoutFilter} [optionsWithoutFilter]
  */
  constructor(nameOrNames, filterOrOptions, optionsWithoutFilter) {
    const {
      allowSymlinks,
      filter,
      stopDirectory,
      cache = true,
    } = typeof filterOrOptions === 'function'
      ? {...optionsWithoutFilter, filter: filterOrOptions}
      : {...filterOrOptions}

    this.#stopDirectory = stopDirectory
    this.#cache = cache
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

// Subclass for better tree-shaking

class FileSearcher extends SearcherInternal {
  /** @protected */
  findInDirectory = findFileInDirectory
}

class DirectorySearcher extends SearcherInternal {
  /** @protected */
  findInDirectory = findDirectoryInDirectory
}

class Searcher extends SearcherInternal {
  /** @protected */
  findInDirectory = findInDirectory
}

/**
@param {typeof FileSearcher | typeof DirectorySearcher | typeof Searcher} Searcher
@param {NameOrNames} nameOrNames
@param {SearchClosestOptions} [options]
*/
function searchClosestInternal(
  Searcher,
  nameOrNames,
  {cwd, allowSymlinks, filter, stopDirectory} = {},
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
function searchClosestFile(nameOrNames, options) {
  return searchClosestInternal(FileSearcher, nameOrNames, options)
}

/**
@param {NameOrNames} nameOrNames
@param {SearchClosestOptions} [options]
@returns {SearchResult}
*/
function searchClosestDirectory(nameOrNames, options) {
  return searchClosestInternal(DirectorySearcher, nameOrNames, options)
}

/**
@param {NameOrNames} nameOrNames
@param {SearchClosestOptions} [options]
@returns {SearchResult}
*/
function searchClosest(nameOrNames, options) {
  return searchClosestInternal(Searcher, nameOrNames, options)
}

export {
  DirectorySearcher,
  FileSearcher,
  searchClosest,
  searchClosestDirectory,
  searchClosestFile,
  Searcher,
}
