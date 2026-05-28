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

@typedef {Filter | SearcherOptions} FilterOrSearcherOptions

@typedef {Omit<SearcherOptions, "filter">} SearcherOptionsWithoutFilter

@typedef {{
  cache?: boolean,
}} SearchOptions

@typedef {
  Omit<SearcherOptions, 'cache'> & {
    cwd?: OptionalUrlOrPath,
  }
} SearchClosestOptions

@typedef {Filter | SearchClosestOptions} FilterOrSearchClosestOptions

@typedef {Omit<SearchClosestOptions, "filter">} SearchClosestOptionsWithoutFilter

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
  @param {FilterOrSearcherOptions} [filterOrOptions]
  @param {SearcherOptionsWithoutFilter} [optionsWithoutFilter]
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
@param {FilterOrSearchClosestOptions} [filterOrOptions]
@param {SearchClosestOptionsWithoutFilter} [optionsWithoutFilter]
*/
function searchClosestInternal(
  Searcher,
  nameOrNames,
  filterOrOptions,
  optionsWithoutFilter,
) {
  const {cwd, allowSymlinks, filter, stopDirectory} =
    typeof filterOrOptions === 'function'
      ? {...optionsWithoutFilter, filter: filterOrOptions}
      : {...filterOrOptions}

  return new Searcher(nameOrNames, {
    allowSymlinks,
    filter,
    stopDirectory,
    cache: false,
  }).search(cwd)
}

/**
@param {NameOrNames} nameOrNames
@param {FilterOrSearchClosestOptions} [filterOrOptions]
@param {SearchClosestOptionsWithoutFilter} [optionsWithoutFilter]
@returns {SearchResult}
*/
function searchClosestFile(nameOrNames, filterOrOptions, optionsWithoutFilter) {
  return searchClosestInternal(
    FileSearcher,
    nameOrNames,
    filterOrOptions,
    optionsWithoutFilter,
  )
}

/**
@param {NameOrNames} nameOrNames
@param {FilterOrSearchClosestOptions} [filterOrOptions]
@param {SearchClosestOptionsWithoutFilter} [optionsWithoutFilter]
@returns {SearchResult}
*/
function searchClosestDirectory(
  nameOrNames,
  filterOrOptions,
  optionsWithoutFilter,
) {
  return searchClosestInternal(
    DirectorySearcher,
    nameOrNames,
    filterOrOptions,
    optionsWithoutFilter,
  )
}

/**
@param {NameOrNames} nameOrNames
@param {FilterOrSearchClosestOptions} [filterOrOptions]
@param {SearchClosestOptionsWithoutFilter} [optionsWithoutFilter]
@returns {SearchResult}
*/
function searchClosest(nameOrNames, filterOrOptions, optionsWithoutFilter) {
  return searchClosestInternal(
    Searcher,
    nameOrNames,
    filterOrOptions,
    optionsWithoutFilter,
  )
}

export {
  DirectorySearcher,
  FileSearcher,
  searchClosest,
  searchClosestDirectory,
  searchClosestFile,
  Searcher,
}
