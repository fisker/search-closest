import {DirectorySearcher, FileSearcher, Searcher} from './searchers.js'

/**
@import {NameOrNames} from 'find-in-directory/find.js'
@import {SearcherOptions, OptionalUrlOrPath, SearchResult} from './searcher.js'

@typedef {
  Omit<SearcherOptions, 'cache'> & {
    cwd?: OptionalUrlOrPath,
  }
} SearchClosestOptions
*/

/**
@param {NameOrNames} nameOrNames
@param {SearchClosestOptions & {
  Searcher: typeof FileSearcher | typeof DirectorySearcher | typeof Searcher
}} options
*/
function searchClosestInternal(
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
  return searchClosestInternal(nameOrNames, {
    ...options,
    Searcher: FileSearcher,
  })
}

/**
@param {NameOrNames} nameOrNames
@param {SearchClosestOptions} [options]
@returns {SearchResult}
*/
function searchDirectory(nameOrNames, options) {
  return searchClosestInternal(nameOrNames, {
    ...options,
    Searcher: DirectorySearcher,
  })
}

/**
@param {NameOrNames} nameOrNames
@param {SearchClosestOptions} [options]
@returns {SearchResult}
*/
function searchClosest(nameOrNames, options) {
  return searchClosestInternal(nameOrNames, {
    ...options,
    Searcher,
  })
}

export {searchClosest, searchDirectory, searchFile}
