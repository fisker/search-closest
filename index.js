import {toAbsolutePath} from 'url-or-path'
import {DirectorySearcher, FileSearcher} from './searcher.js'

/**
@import {UrlOrPath} from 'url-or-path'
@import {Predicate, NameOrNames} from 'find-in-directory'
*/
/** @typedef {{
  stopDirectory?: UrlOrPath,
  allowSymlinks?: boolean,
  filter?: Predicate,
  cache?: boolean,
}} Options*/

const searchers = new Map()
const filterCacheKeys = new Map()
function search(startDirectory, nameOrNames, options) {
  let {
    stopDirectory,
    type,
    allowSymlinks,
    filter,
    Searcher,
    cache: shouldCache,
  } = options ?? {}

  stopDirectory = stopDirectory ? toAbsolutePath(stopDirectory) : undefined

  if (filter && !filterCacheKeys.has(filter)) {
    filterCacheKeys.set(filter, filterCacheKeys.size)
  }

  const cacheKey = JSON.stringify({
    nameOrNames,
    stopDirectory,
    type,
    allowSymlinks,
    filterCacheKey: filterCacheKeys.get(filter),
  })

  if (!searchers.has(cacheKey)) {
    searchers.set(
      cacheKey,
      new Searcher({
        nameOrNames,
        stopDirectory,
        allowSymlinks,
        filter,
      }),
    )
  }

  const searcher = searchers.get(cacheKey)
  return searcher.search(toAbsolutePath(startDirectory), {shouldCache})
}

/**
Find closest file matches name or names.

@param {UrlOrPath} startDirectory
@param {NameOrNames} nameOrNames
@param {Options} [options]
@returns {Promise<string | void>}
*/
function searchClosestFile(startDirectory, nameOrNames, options) {
  return search(startDirectory, nameOrNames, {
    ...options,
    type: 'file',
    Searcher: FileSearcher,
  })
}

/**
Find closest directory matches name or names.

@param {UrlOrPath} startDirectory
@param {NameOrNames} nameOrNames
@param {Options} [options]
@returns {Promise<string | void>}
*/
function searchClosestDirectory(startDirectory, nameOrNames, options) {
  return search(startDirectory, nameOrNames, {
    ...options,
    type: 'directory',
    Searcher: DirectorySearcher,
  })
}

/**
Clear caches.

@returns {void}
*/
function clearCache() {
  searchers.clear()
  filterCacheKeys.clear()
}

export {clearCache, searchClosestDirectory, searchClosestFile}
export {DirectorySearcher, FileSearcher} from './searcher.js'
