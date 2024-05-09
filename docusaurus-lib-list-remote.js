import { request } from "@octokit/request";
import { minimatch } from "minimatch";

// const octokit = new Octokit({
//   // userAgent: "docusaurus-lib-list-remote" // TODO customize per usage?!
// });



const listRemote = {
  minimatchOpts: {
    matchBase: true,
    nonegate: true, // no need to support negation i.e. only positive files matching
  },
  OCTOKIT_TREE_FILE_TYPE: 'blob',

  /**
   * Create GitHub repository object of `https://github.com/<repoOwner>/<repoName>`
   * with a given `primaryBranch` (which can also be a `tree sha`).
   * 
   * Example for https://github.com/xmtp-labs/web-starter:
   * - repoOwner: xmtp-labs
   * - repoName: web-starter
   * - primaryBranch: main
   * pointing to https://github.com/xmtp-labs/web-starter/tree/main
   * 
   * Note that tree sha `f4d4f39a575dbd03df37941391f8b088f6cf48aa` could also be used as `primaryBranch` value
   * to reference to https://github.com/xmtp-labs/web-starter/tree/f4d4f39a575dbd03df37941391f8b088f6cf48aa.
   * 
   * @param {String} repoOwner Repository object created with `createRepo`.
   * @param {String} repoName Array of filters for files to be included.
   * @param {String} primaryBranch Array of filters for files to be excluded.
   */
  createRepo: (repoOwner, repoName, primaryBranch) => {
    return {
      'owner': repoOwner,
      'name': repoName,
      'branch': primaryBranch
    }
  },

  /**
   * Helper to builds `sourceBaseUrl` value for `docusaurus-plugin-remote-content` plugin from `repo` object.
   * 
   * @param {object} repo Repository object created with `createRepo`.
   */
  buildRepoRawBaseUrl: (repo) => {
    return `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${repo.branch}`
  },

  /**
   * Lists files in repository `repo` that match `includeFilters` filter but excluding those matching `excludeFilters` filters.
   * It uses [minimatch](https://github.com/isaacs/minimatch) for filters syntax.
   * 
   * Example:
   *   List all *.md files but those matching `internal/docs*.md` (note that the include filter below had to be escaped with \)
   *   
   *   listDocuments(repo, ['**\/*.md'], ['internal/docs*.md'])
   *
   * @param {object} repo Repository object created with `createRepo`.
   * @param {String[]} [includeFilters] Array of filters for files to be included.
   * @param {String[]} [excludeFilters] (Optional) Array of filters for files to be excluded.
   */
  listDocuments: function (repo, includeFilters, excludeFilters = []) {
    const req = 'GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1'
    return request(req, {
      owner: repo.owner,
      repo: repo.name,
      tree_sha: repo.branch
    }).then(repoTreeResponse => {
      console.log(this)
      const repoFilePaths = this.extractFilesFromTree(repoTreeResponse.data.tree);
      console.log(`\nRetrieved all file paths: ${repoFilePaths}`)

      const resultingFilePaths = this.applyFilters(repoFilePaths, includeFilters, excludeFilters)
      console.log(`\nResulting file paths: ${resultingFilePaths}`)

      return resultingFilePaths
    })
  },

  extractFilesFromTree: function (treeElements) {
    console.log("\nExtracting files from tree elements")
    return treeElements
      .filter(treeElement => treeElement.type === this.OCTOKIT_TREE_FILE_TYPE) // files only
      .map(treeElement => treeElement.path)
  },

  applyFilters: function (paths, includeFilters, excludeFilters) {
    console.log(`\nApplying include filters (${includeFilters}) to (${paths})`)
    const pathsFilteredIncluded = this.applyIncludeFilters(paths, includeFilters)

    console.log(`\nApplying exclude filters (${excludeFilters}) to (${pathsFilteredIncluded})`)
    return this.applyExcludeFilters(pathsFilteredIncluded, excludeFilters)
  },

  applyIncludeFilters: function (paths, filters) {
    const unique = function (a) {
      return Array.from(new Set(a));
    }

    const pathsFilteredArray = filters.map(filter => {
      return minimatch.match(paths, filter, this.minimatchOpts)
    })
    let pathsFilteredFlattened = [].concat(...pathsFilteredArray)

    return unique(pathsFilteredFlattened)
  },

  applyExcludeFilters: function (paths, excludeFilters) {
    const excludedPathsArray = excludeFilters.map(excludeFilter => {
      return minimatch.match(paths, excludeFilter, minimatchOpts)
    })
    const excludedPaths = [].concat(...excludedPathsArray)
    return paths.filter(p => !excludedPaths.includes(p))
  },
}
// module.exports = {
//   createRepo,
//   buildRepoRawBaseUrl,
//   listDocuments,

//   // NOTE exposed for tests only
//   extractFilesFromTree,
//   applyFilters,
//   applyIncludeFilters,
//   applyExcludeFilters,
// };

export default listRemote