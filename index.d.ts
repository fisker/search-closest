export type Options = {
  stopDirectory?: UrlOrPath
  allowSymlinks?: boolean
  filter?: Predicate
  cache?: boolean
}
/**
Clear caches.

@returns {void}
*/
export function clearCache(): void
/**
Find closest directory matches name or names.

@param {UrlOrPath} startDirectory
@param {NameOrNames} nameOrNames
@param {Options} [options]
@returns {Promise<string | void>}
*/
export function searchClosestDirectory(
  startDirectory: UrlOrPath,
  nameOrNames: NameOrNames,
  options?: Options,
): Promise<string | void>
/**
Find closest file matches name or names.

@param {UrlOrPath} startDirectory
@param {NameOrNames} nameOrNames
@param {Options} [options]
@returns {Promise<string | void>}
*/
export function searchClosestFile(
  startDirectory: UrlOrPath,
  nameOrNames: NameOrNames,
  options?: Options,
): Promise<string | void>
import type {UrlOrPath} from 'url-or-path'
import type {Predicate} from 'find-in-directory'
import type {NameOrNames} from 'find-in-directory'
export {DirectorySearcher, FileSearcher} from './searcher.js'
