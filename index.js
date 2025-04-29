import process from 'node:process'
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
  SearcherOptions & {
    searchInDirectory: typeof findFile | typeof findDirectory
  }
} GenericSearcherOptions

@typedef {
  Omit<SearcherOptions, 'cache'> & {
    cwd?: OptionalUrlOrPath,
  }
} SearchClosestOptions
*/

class Searcher {
  #stopDirectory
  #cache
  #resultCache = new Map()
  #searchInDirectory

  /**
  @param {NameOrNames} nameOrNames
  @param {GenericSearcherOptions} options
  */
  constructor(
    nameOrNames,
    {allowSymlinks, filter, stopDirectory, searchInDirectory, cache},
  ) {
    this.#stopDirectory = stopDirectory
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

  @param {OptionalUrlOrPath} [startDirectory]
  @param {SearchOptions} [options]
  @returns {Promise<string | void>}
  */
  async search(startDirectory, options) {
    startDirectory ??= process.cwd()
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
  @param {NameOrNames} nameOrNames
  @param {SearcherOptions} [options]
  */
  constructor(nameOrNames, options) {
    super(nameOrNames, {...options, searchInDirectory: findFile})
  }
}

class DirectorySearcher extends Searcher {
  /**
  @param {NameOrNames} nameOrNames
  @param {SearcherOptions} [options]
  */
  constructor(nameOrNames, options) {
    super(nameOrNames, {...options, searchInDirectory: findDirectory})
  }
}

/**
@param {NameOrNames} nameOrNames
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
@param {NameOrNames} nameOrNames
@param {SearchClosestOptions} [options]
@returns {ReturnType<FileSearcher['search']>}
*/
function searchFile(nameOrNames, options) {
  return searchClosest(nameOrNames, {...options, Searcher: FileSearcher})
}

/**
@param {NameOrNames} nameOrNames
@param {SearchClosestOptions} [options]
@returns {ReturnType<DirectorySearcher['search']>}
*/
function searchDirectory(nameOrNames, options) {
  return searchClosest(nameOrNames, {...options, Searcher: DirectorySearcher})
}

export {DirectorySearcher, FileSearcher, searchDirectory, searchFile}
