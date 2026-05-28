import {findDirectory, findFile, findInDirectory} from 'find-in-directory'
import {Searcher as SearchInternal} from './searcher.js'

// Subclass for better tree-shaking

class FileSearcher extends SearchInternal {
  /** @protected */
  findInDirectory = findFile
}

class DirectorySearcher extends SearchInternal {
  /** @protected */
  findInDirectory = findDirectory
}

class Searcher extends SearchInternal {
  /** @protected */
  findInDirectory = findInDirectory
}

export {FileSearcher, DirectorySearcher, Searcher}
