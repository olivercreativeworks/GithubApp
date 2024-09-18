/**
 * https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-for-the-authenticated-user
 * 
 * @typedef {object} createRepoResponse There are additional properties on this object. Check the schema at the link above and add those properties as you need to.
 * @prop {string} createRepoResponse.id,
 * @prop {string} createRepoResponse.node_id,
 * @prop {string} createRepoResponse.name,
 * @prop {string} createRepoResponse.full_name,
 * @prop {boolean} createRepoResponse.private
 * @prop {string} createRepoResponse.html_url
 * @prop {string} createRepoResponse.blobs_url
 * @prop {string} createRepoResponse.description
 * @prop {string} createRepoResponse.visibility
 * 
 * @param {object} config
 * @param {string} config.token
 * @param {string} config.name
 * @param {string} config.description
 * @param {boolean} config.isPrivate
 * 
 * @return {createRepoResponse}
 */
function createRepo({token, name, description, isPrivate}){
  // /user/repos
  const urlCreateRepo = `https://api.github.com/user/repos`
  const headers = {
    accept: 'application/vnd.github+json',
    authorization: token ? `Bearer ${token}` : '',
  }
  const payload = {
    name: name,
    description: description,
    private: isPrivate,
    auto_init:true // Set to true to avoid this error when trying to push files into repo: Request failed for https://api.github.com returned code 409. Truncated server response: {"message":"Git Repository is empty.","documentation_url":"https://docs.github.com/rest/git/blobs#create-a-blob","status":"409"}
  }
  const options = {
    method: 'POST',
    headers,
    payload: JSON.stringify(payload),
    // muteHttpExceptions: true,
  }
  const result = UrlFetchApp.fetch(urlCreateRepo, options)
  return JSON.parse(result.getContentText())
}

/**
 * Get a branch using Github API. Based on the [Github API documentation](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#get-a-reference).
 * 
 * @typedef {object} getReferenceResponse
  * @prop {string} getReferenceResponse.ref Takes the form of 'refs/heads/<branchName>'
  * @prop {string} getReferenceResponse.node_id
  * @prop {string} getReferenceResponse.url The link to the branch
  * @prop {object} getReferenceResponse.object
  * @prop {string} getReferenceResponse.object.sha The commit sha
  * @prop {string} getReferenceResponse.object.type I've only seen this be 'commit'
  * @prop {string} getReferenceResponse.object.url Seems to be a url to JSON page with most recent commit details
 * 
 * @param {object} config
  * @param {string} config.owner Who owns the repo
  * @param {string} config.repo The name of the repo. Capitalization doesn't matter.
  * @param {string} [config.token] Optional auth token. Apparently you won't get rate limtied as much if you provide it.
  * @param {string} config.branchName The name of the branch.
 *
 * @return {getReferenceResponse}
 */
function getReference({owner, repo, branchName, token}){
  // The endpoint is: /repos/{owner}/{repo}/git/ref/{ref} 
  // The {ref} part is "heads/<branchName>" for branches or "tags/<tagName>" for tags
  const urlGetBranch = `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branchName}`
  const headers = {
    accept: 'application/vnd.github+json',
    authorization: token ? `Bearer ${token}` : '',
  }
  const options = {
    headers,
    // muteHttpExceptions: true
  }
  const result = UrlFetchApp.fetch(urlGetBranch, options)
  return JSON.parse(result.getContentText())
}

/**
 * https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#get-a-branch
 * @typedef {object} getBranchResponse
 * @prop {object} commit
 * @prop {string} sha
 * @prop {string} node_id
 * @prop {GithubApi.CommitDetails} commit
 * @prop {GithubApi.ParentCommit[]} parents
 * 
 *  @param {object} config
  * @param {string} config.owner Who owns the repo
  * @param {string} config.repo The name of the repo. Capitalization doesn't matter.
  * @param {string} [config.token] Optional auth token. Apparently you won't get rate limtied as much if you provide it.
  * @param {string} config.branchName The name of the branch.
 *
 */
function getBranch({owner, repo, branchName, token}){
  const urlGetBranch = `https://api.github.com/repos/${owner}/${repo}/branches/${branchName}`
  const headers = {
    accept: 'application/vnd.github+json',
    authorization: token ? `Bearer ${token}` : '',
  }
  const options = {
    headers,
    // muteHttpExceptions: true
  }
  const result = UrlFetchApp.fetch(urlGetBranch, options)
  return JSON.parse(result.getContentText())
}

function calling2(){
  console.log(getBranch({owner:'olivercreativeworks', repo:'GithubApp', branchName:'testBranch'}))
  // console.log(getBranch({owner:'olivercreativeworks', repo:'GithubApp', branchName:'testBranch'}))
}

/**
 * Create a branch using Github API. Based on the [Github API documentation](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#create-a-reference).
 * 
 * @typedef {object} createBranchResponse
  * @prop {string} createBranchResponse.ref
  * @prop {string} createBranchResponse.node_id
  * @prop {string} createBranchResponse.url
  * @prop {object} createBranchResponse.object
  * @prop {string} createBranchResponse.object.sha
  * @prop {string} createBranchResponse.object.type
  * @prop {string} createBranchResponse.object.url
 * 
 * @param {object} config
  * @param {string} config.owner
  * @param {string} config.repo
  * @param {string} config.token
  * @param {string} config.branchName
  * @param {string} config.sha The source branch's sha
 *
 * @return {createBranchResponse}
 */
function createBranch({owner, repo, branchName, token, sha}) {
  const urlCreateRef = `https://api.github.com/repos/${owner}/${repo}/git/refs`
  const headers = {
    authorization: `Bearer ${token}`,
    accept: 'application/vnd.github+json'
  }
  const payload = {
    sha: sha,
    ref: `refs/heads/${branchName}`
  }
  const options = {
    // muteHttpExceptions: true,
    headers,
    payload: JSON.stringify(payload),
    method: 'POST'
  }
  const result = UrlFetchApp.fetch(urlCreateRef, options)
  return JSON.parse(result.getContentText())
}
/**
 * Deletes the branch. Throws if the branch was not deleted. Based on the [Github API documentation](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#delete-a-reference).
 * 
 * @param {object} config
  * @param {string} config.owner
  * @param {string} config.repo
  * @param {string} config.token
  * @param {string} config.branchName
 * 
 */
function deleteBranch({owner, repo, branchName, token}){
  const urlDeleteRef = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branchName}`
  const headers = {
    authorization: `Bearer ${token}`,
    accept: 'application/vnd.github+json'
  }
  const options = {
    method: 'DELETE',
    headers,
    // muteHttpExceptions: true,
  }
  const result = UrlFetchApp.fetch(urlDeleteRef, options)
  // 204 code means the branch was successfully deleted
  if(result.getResponseCode() !== 204){
    throw new Error(JSON.parse(result.getContentText()))
  }
  return
}

/**
 * Gets the file at the specified path. Based on the [Github API documentation](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28).
  * 
  * The file's contents will be in the response's content property as a base64 encoded string. To get the file contents you can use the following code.
  * ```
  * const decoded = Utilities.base64Decode(response.content)
  * const blob = Utilities.newBlob(decoded)
  * const fileContent = blob.getDataAsString()
  * console.log(fileContent)
  * ```
 * 
 * @typedef {object} getFileResponse
  * @prop {string} getFileResponse.name File's name
  * @prop {string} getFileResponse.path File's path
  * @prop {string} getFileResponse.sha Most recent commit sha
  * @prop {string} getFileResponse.size
  * @prop {string} getFileResponse.url
  * @prop {string} getFileResponse.html_url The url to open the file on gitub
  * @prop {string} getFileResponse.git_url
  * @prop {string} getFileResponse.download_url
  * @prop {string} getFileResponse.type I've only seen this be 'file'
  * @prop {string} getFileResponse.content Base 64 encoded string of the file's contents 
  * @prop {string} getFileResponse.encoding Tells you the type of encoding that is used for the content. I've only seen this be 'base64'
  * @prop {object} getFileResponse._links
  * @prop {string} getFileResponse._links.self
  * @prop {string} getFileResponse._links.git
  * @prop {string} getFileResponse._links.html
 * 
 * @param {object} config
  * @param {string} config.owner
  * @param {string} config.repo
  * @param {string} [config.token]
  * @param {string} config.path
  * @param {string} [config.branchName]
 *
 * @return {getFileResponse}
 */
function getFile({owner, repo, path, branchName, token}){
  const ref = branchName ? `?ref=${encodeURIComponent(branchName)}` : ''
  const getContentUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}${ref}`
  const headers = {
    accept: 'application/vnd.github+json',
    authorization: token ? `Bearer ${token}` : '',
  }
  const options = {
    headers,
    // muteHttpExceptions: true
  }
  const result = UrlFetchApp.fetch(getContentUrl, options)
  return JSON.parse(result.getContentText())
}

/**
 * Delete a file. Based on the [Github API documentation](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#delete-a-file)
 * 
 * @typedef {object} deleteFileResponse
  * @prop {null} content
  * @prop {GithubApi.CommitDetails & {parents: GithubApi.ParentCommit[]}} commit
 * 
 * @param {string} commitMessage
 * @param {object} config
  * @param {string} config.owner
  * @param {string} config.repo The repo the file is in.
  * @param {string} config.token
  * @param {string} config.path Path to the file you want to update
  * @param {string} config.sha The sha of the file you want to delete.
  * @param {string} [config.branchName]
 *
 */
function deleteFile(commitMessage, {owner, repo, path, sha, branchName, token}){
  const deleteFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  const headers = {
    accept: 'application/vnd.github+json',
    authorization: token ? `Bearer ${token}` : '',
  }
  const payload = {
    message: commitMessage,
    sha: sha,
    branch: branchName
  }
  const options = {
    method: 'DELETE',
    headers,
    payload: JSON.stringify(payload),
    // muteHttpExceptions: true
  }
  const result = UrlFetchApp.fetch(deleteFileUrl, options)
  return JSON.parse(result.getContentText())
}

/**
 * Creates or updates a file. Based on the [Github API documentation](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents).
 * 
 * @param {string} fileContent
 * @param {string} commitMessage
 * @param {object} config
  * @param {string} config.owner
  * @param {string} config.repo The repo the file is in.
  * @param {string} config.token
  * @param {string} config.path Path to the file you want to update
  * @param {string} [config.sha] **Required if you are updating a file**. The sha of the file you want to update.
  * @param {string} [config.branchName]
 * 
 */
function createOrUpdateFile(fileContent, commitMessage, {owner, repo, path, sha, branchName, token}){
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  const headers = {
    accept : 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
  }
  const payload = {
    message: commitMessage,
    content: Utilities.base64Encode(fileContent), // fileContent must be encoded as base64 string
    sha: sha,
    ...(branchName ? {branch:branchName} : undefined)
  }
  const options = {
    method: 'PUT',
    headers,
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  }
  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

/**
 * Merge two branches. Based on the [Github API documentation](https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#merge-a-branch)
 * 
 * @typedef {Object} mergeResponse
  * @prop {string} url The URL of the commit. Example: "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e"
  * @prop {string} sha The SHA of the commit. Example: "6dcb09b5b57875f334f61aebed695e2e4193db5e"
  * @prop {string} node_id The node ID of the commit. Example: "MDY6Q29tbWl0NmRjYjA5YjViNTc4NzVmMzM0ZjYxYWViZWQ2OTVlMmU0MTkzZGI1ZQ=="
  * @prop {string} html_url The HTML URL of the commit. Example: "https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e"
  * @prop {string} comments_url The URL to fetch comments on the commit. Example: "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e/comments"
  * @prop {GithubApi.CommitDetails} commit Commit details
  * @prop {GithubApi.Author} mergeResponse.author Author user details or null.
  * @prop {GithubApi.Committer|null} mergeResponse.committer Committer user details or null.
  * @prop {GithubApi.ParentCommit[]} parents List of parent commits.
 * 
 * @param {object} config
  * @param {string} config.owner
  * @param {string} config.repo
  * @param {string} config.token
  * @param {string} config.base The name of the base branch that the head will be merged into.
  * @param {string} config.head The head to merge. This can be a branch name or a commit SHA1.
  * @param {string} [config.commitMessage] Github API's default message will be used if not provided
 *
 * @return {mergeResponse}
 */
function merge({owner, repo, token, base, head, commitMessage}){
  const url = `https://api.github.com/repos/${owner}/${repo}/merges`
  const headers = {
    accept : 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
  }
  const payload = {
    base,
    head,
    ...(commitMessage ? {commitMessage} : undefined),
  }
  const options = {
    method: 'POST',
    headers,
    payload: JSON.stringify(payload),
    // muteHttpExceptions: true,
  }
  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

/**
 * https://docs.github.com/en/rest/git/blobs?apiVersion=2022-11-28#create-a-blob
 * 
 * @typedef {object} createBlobResponse
 * @prop {string} url
 * @prop {string} sha
 * 
 * @param {object} config
 * @param {string} config.owner
 * @param {string} config.repo
 * @param {string} config.token
 * @param {string} config.content
 * 
 * @return {createBlobResponse}
 */
function createBlob({owner, repo, token, content}){
  const url = `https://api.github.com/repos/${owner}/${repo}/git/blobs`
  const headers = {
    accept : 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
  }
  const payload = {
    content: Utilities.base64Encode(content),
    encoding:'base64'
  }
  const options = {
    method: 'POST',
    headers,
    payload: JSON.stringify(payload)
  }

  const resp = UrlFetchApp.fetch(url, options)
  return JSON.parse(resp.getContentText())
}

/**
 * https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28#create-a-tree
 * 
 * @typedef {object} createTreeResponse
 * @prop {string} sha
 * @prop {string} url
 * @prop {boolean} truncated
 * @prop {object} tree Define this as needed
 * 
 * @typedef {object} GitBlob
 * @prop {string} sha
 * @prop {string} path
 * 
 * @param {object} config
 * @param {string} config.owner
 * @param {string} config.repo
 * @param {string} config.token
 * @param {GitBlob[]} config.blobs
 * @param {string} [config.baseTreeSha]
 * 
 * @return {createTreeResponse}
 */
function createTree({owner, repo, token, blobs, baseTreeSha}){
  //post /repos/{owner}/{repo}/git/trees
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees`
  const headers = {
    accept : 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
  }
  const trees = blobs.map(blob => {
    return {
      path:blob.path,
      sha:blob.sha,
      mode: '100644',
      type: 'blob'
    }
  })
  const payload = {
    tree: trees,
    ...(baseTreeSha ? {base_tree:baseTreeSha} : undefined )
  }
  const options = {
    method: 'POST',
    headers,
    payload: JSON.stringify(payload)
  }
  const resp = UrlFetchApp.fetch(url, options)
  return JSON.parse(resp.getContentText())
}

/**
 * https://docs.github.com/en/rest/git/commits?apiVersion=2022-11-28#create-a-commit
 * 
 * @typedef {object} createCommitResponse Add additional fields as necessary
  * @prop {string} createCommitResponse.sha
  * @prop {string} createCommitResponse.node_id
  * @prop {string} createCommitResponse.url
  * @prop {string} createCommitResponse.message
  * @prop {string} createCommitResponse.html_url
  * @prop {object} createCommitResponse.author
  * @prop {object} createCommitResponse.committer
  * @prop {object} createCommitResponse.tree
  * @prop {object[]} createCommitResponse.parents
  * @prop {object} createCommitResponse.verification
 * 
 * @param {object} config
 * @param {string} config.owner
 * @param {string} config.repo
 * @param {string} config.token
 * @param {string} config.commitMessage
 * @param {string} config.treeSha The sha of the tree to commit
 * @param {string[]} config.parentCommitShas The commit shas of the parent commits. Usually this will be the most recent commit, or in the case of a merge, the shas of the commits the merge is based on. [See explanation here](https://stackoverflow.com/questions/38239521/what-is-the-parent-of-a-git-commit-how-can-there-be-more-than-one-parent-to-a-g).
 * 
 * @return {createCommitResponse}
 */
function createCommit({owner, repo, token, commitMessage, treeSha, parentCommitShas}){
//   post
// /repos/{owner}/{repo}/git/commits
   const url = `https://api.github.com/repos/${owner}/${repo}/git/commits`
  const headers = {
    accept : 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
  }
  const payload = {
    message: commitMessage,
    tree: treeSha,
    ...(parentCommitShas ? {parents:parentCommitShas} : undefined)
  }
  const options = {
    method: 'POST',
    headers,
    payload: JSON.stringify(payload)
  }
  const resp = UrlFetchApp.fetch(url, options)
  return JSON.parse(resp.getContentText())
}

/**
 * https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#update-a-reference
 * 
 * @typedef {object} updateReferenceResponse
 * @prop {string} updateReferenceResponse.ref
 * @prop {string} updateReferenceResponse.node_id
 * @prop {string} updateReferenceResponse.url
 * @prop {object} updateReferenceResponse.object
 * @prop {string} updateReferenceResponse.object.sha
 * @prop {string} updateReferenceResponse.object.type
 * @prop {string} updateReferenceResponse.object.url
 * 
 * @param {object} config
 * @param {string} config.owner
 * @param {string} config.repo
 * @param {string} config.token
 * @param {string} config.branchName
 * @param {string} config.commitSha
 */
function updateReference({owner, repo, token, branchName, commitSha}){
  const url = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branchName}`
  const headers = {
    accept : 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
  }
  const payload = {
    sha: commitSha,
    force: false
  }
  const options = {
    method: 'PATCH',
    headers,
    payload: JSON.stringify(payload)
  }
  const resp = UrlFetchApp.fetch(url, options)
  return JSON.parse(resp.getContentText())
}

/**
 * https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28#get-a-tree
 * @typedef {object} getTreeResponse
  * @prop {string} sha
  * @prop {string} url
  * @prop {boolean} truncated
  * @prop {GitTree.File[]} tree 
 * 
 * @typedef {object} GitTree.File
  * @prop {string} TreeObject.path
  * @prop {string} TreeObject.mode
  * @prop {string} TreeObject.type
  * @prop {string} TreeObject.sha
  * @prop {number} TreeObject.size
  * @prop {string} TreeObject.url
 * 
 * @param {object} config
  * @param {string} config.owner
  * @param {string} config.repo
  * @param {string} config.token
  * @param {string} config.branchName
 * 
 * @return {getTreeResponse}
 */
function getTree({owner, repo, token, branchName}){
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branchName}`
  const headers = {
    accept : 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
  }
  const options = {
    method: 'GET',
    headers,
  }
  const resp = UrlFetchApp.fetch(url, options)
  return JSON.parse(resp.getContentText())
}

/**
 * https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28#compare-two-commits
 * @param {object} config
 * @param {string} config.owner
 * @param {string} config.repo
 * @param {string} config.base
 * @param {string} config.head
 * @param {string} config.token
 */
function compareCommits({owner, repo, base, head, token}){
  const url = `https://api.github.com/repos/${owner}/${repo}/compare/${base}...${head}`
  const headers = {
    accept : 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
  }
  const options = {
    method: 'GET',
    headers,
  }
  const resp = UrlFetchApp.fetch(url, options)
  return JSON.parse(resp.getContentText())
}

function reuabove(){
  const t = getTree({owner: 'olivercreativeworks', repo:'octokit-repo', token:PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN'), branchName:'main'})
  console.log(t)
}
