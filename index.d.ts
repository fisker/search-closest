export type SearcherOptions = {
  allowSymlinks?: boolean
  filter?: findInDirectory.Predicate
  stopDirectory?: string
  cache?: boolean
}
export type SearchOptions = {
  cache?: boolean
}
export type GenericSearcherOptions = SearcherOptions & {
  searchInDirectory: typeof findFile | typeof findDirectory
}
export type SearchClosestOptions = Omit<SearcherOptions, 'cache'> & {
  cwd?: UrlOrPath
}
/**
@property {any} search
*/
export class DirectorySearcher extends Searcher {
  /**
    @param {findInDirectory.NameOrNames} nameOrNames
    @param {SearcherOptions} [options]
    */
  constructor(
    nameOrNames: findInDirectory.NameOrNames,
    options?: SearcherOptions,
  )
}
export class FileSearcher extends Searcher {
  /**
    @param {findInDirectory.NameOrNames} nameOrNames
    @param {SearcherOptions} [options]
    */
  constructor(
    nameOrNames: findInDirectory.NameOrNames,
    options?: SearcherOptions,
  )
}
/**
@param {findInDirectory.NameOrNames} nameOrNames
@param {SearchClosestOptions} [options]
@returns {ReturnType<DirectorySearcher['search']>}
*/
export function searchClosestDirectory(
  nameOrNames: findInDirectory.NameOrNames,
  options?: SearchClosestOptions,
): ReturnType<DirectorySearcher['search']>
/**
@param {findInDirectory.NameOrNames} nameOrNames
@param {SearchClosestOptions} [options]
@returns {ReturnType<FileSearcher['search']>}
*/
export function searchClosestFile(
  nameOrNames: findInDirectory.NameOrNames,
  options?: SearchClosestOptions,
): ReturnType<FileSearcher['search']>
import type * as findInDirectory from 'find-in-directory'
import {findFile} from 'find-in-directory'
import {findDirectory} from 'find-in-directory'
import type {UrlOrPath} from 'url-or-path'
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
declare class Searcher {
  /**
    @param {findInDirectory.NameOrNames} nameOrNames
    @param {GenericSearcherOptions} options
    */
  constructor(
    nameOrNames: findInDirectory.NameOrNames,
    {
      allowSymlinks,
      filter,
      stopDirectory,
      searchInDirectory,
      cache,
    }: GenericSearcherOptions,
  )
  /**
    Find closest file or directory matches name or names.
  
    @param {UrlOrPath} [startDirectory]
    @param {SearchOptions} [options]
    @returns {Promise<string | void>}
    */
  search(
    startDirectory?: UrlOrPath,
    options?: SearchOptions,
  ): Promise<string | void>
  /**
    Clear caches.
  
    @returns {void}
    */
  clearCache(): void
  #private
}
export {}
