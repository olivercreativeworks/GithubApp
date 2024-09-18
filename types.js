/**
 * @typedef GithubApi.ParentCommit
  * @prop {string} sha SHA of the parent commit. 
  * @prop {string} url URL of the parent commit.
  * @prop {string} html_url
 */

/**
 * @typedef GithubApi.Committer
  * @prop {string|null} [name] Name of the committer, can be null.
  * @prop {string|null} [email] Email of the committer, can be null.
  * @prop {string} [login] Login username. Example: "octocat"
  * @prop {number} [id] ID of the user. Example: 1
  * @prop {string} [node_id] Node ID of the user. Example: "MDQ6VXNlcjE="
  * @prop {string} [avatar_url] Avatar URL of the user. Example: "https://github.com/images/error/octocat_happy.gif"
  * @prop {string|null} [gravatar_id] Gravatar ID of the committer, can be null.
  * @prop {string} [url] API URL of the committer. Example: "https://api.github.com/users/octocat"
  * @prop {string} [html_url] HTML URL of the committer. Example: "https://github.com/octocat"
  * @prop {string} [followers_url] Followers URL. Example: "https://api.github.com/users/octocat/followers"
  * @prop {string} [following_url] Following URL. Example: "https://api.github.com/users/octocat/following{/other_user}"
  * @prop {string} [gists_url] Gists URL. Example: "https://api.github.com/users/octocat/gists{/gist_id}"
  * @prop {string} [starred_url] Starred URL. Example: "https://api.github.com/users/octocat/starred{/owner}{/repo}"
  * @prop {string} [subscriptions_url] Subscriptions URL. Example: "https://api.github.com/users/octocat/subscriptions"
  * @prop {string} [organizations_url] Organizations URL. Example: "https://api.github.com/users/octocat/orgs"
  * @prop {string} [repos_url] Repositories URL. Example: "https://api.github.com/users/octocat/repos"
  * @prop {string} [events_url] Events URL. Example: "https://api.github.com/users/octocat/events{/privacy}"
  * @prop {string} [received_events_url] Received events URL. Example: "https://api.github.com/users/octocat/received_events"
  * @prop {string} [type] Type of the user. Example: "User"
  * @prop {boolean} [site_admin] Whether the user is a site admin.
  * @prop {string} [starred_at] Time the committer starred the repo. Example: "2020-07-09T00:17:55Z"
 */

/**
 * @typedef GithubApi.Author
  * @prop {string|null} [name] Name of the author, can be null.
  * @prop {string|null} [email] Email of the author, can be null.
  * @prop {string} [login] Login username. Example: "octocat"
  * @prop {number} [id] ID of the user. Example: 1
  * @prop {string} [node_id] Node ID of the user. Example: "MDQ6VXNlcjE="
  * @prop {string} [avatar_url] Avatar URL of the user. Example: "https://github.com/images/error/octocat_happy.gif"
  * @prop {string|null} [gravatar_id] Gravatar ID of the user, can be null.
  * @prop {string} [url] API URL of the user. Example: "https://api.github.com/users/octocat"
  * @prop {string} [html_url] HTML URL of the user. Example: "https://github.com/octocat"
  * @prop {string} [followers_url] Followers URL of the user. Example: "https://api.github.com/users/octocat/followers"
  * @prop {string} [following_url] Following URL of the user. Example: "https://api.github.com/users/octocat/following{/other_user}"
  * @prop {string} [gists_url] Gists URL of the user. Example: "https://api.github.com/users/octocat/gists{/gist_id}"
  * @prop {string} [starred_url] Starred URL of the user. Example: "https://api.github.com/users/octocat/starred{/owner}{/repo}"
  * @prop {string} [subscriptions_url] Subscriptions URL. Example: "https://api.github.com/users/octocat/subscriptions"
  * @prop {string} [organizations_url] Organizations URL. Example: "https://api.github.com/users/octocat/orgs"
  * @prop {string} [repos_url] Repositories URL. Example: "https://api.github.com/users/octocat/repos"
  * @prop {string} [events_url] Events URL. Example: "https://api.github.com/users/octocat/events{/privacy}"
  * @prop {string} [received_events_url] Received events URL. Example: "https://api.github.com/users/octocat/received_events"
  * @prop {string} [type] Type of the user. Example: "User"
  * @prop {boolean} [site_admin] Whether the user is a site admin.
  * @prop {string} [starred_at] Time the user starred the repo. Example: "2020-07-09T00:17:55Z"
 */

/**
 * @typedef GithubApi.CommitDetails
  * @prop {string} url URL of the commit. Example: "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e"
  * @prop {string} message Commit message. Example: "Fix all the bugs"
  * @prop {number} comment_count Number of comments. Example: 0
  * @prop {GithubApi.CommitDetails.Author} [author] Author information or null.
  * @prop {GithubApi.CommitDetails.Committer} [committer] Committer information or null.
  * @prop {GithubApi.CommitDetails.Tree} tree Tree details of the commit.
  * @prop {GithubApi.CommitDetails.Verification} verification Verification details of the commit.
 *
 * @typedef GithubApi.CommitDetails.Author
  * @prop {string} [name] Author's name. Example: "Chris Wanstrath"
  * @prop {string} [email] Author's email. Example: "chris@ozmm.org"
  * @prop {string} [date] Date of the commit. Example: "2007-10-29T02:42:39.000-07:00"
 * 
 * @typedef GithubApi.CommitDetails.Committer
  * @prop {string} [name] Committer's name. Example: "Chris Wanstrath"
  * @prop {string} [email] Committer's email. Example: "chris@ozmm.org"
  * @prop {string} [date] Date of the commit. Example: "2007-10-29T02:42:39.000-07:00"
 * 
 * @typedef GithubApi.CommitDetails.Tree
  * @prop {string} sha The SHA of the tree. Example: "827efc6d56897b048c772eb4087f854f46256132"
  * @prop {string} url URL of the tree. Example: "https://api.github.com/repos/octocat/Hello-World/tree/827efc6d56897b048c772eb4087f854f46256132"
 * 
 * @typedef GithubApi.CommitDetails.Verification
  * @prop {boolean} verified Whether the commit is verified.
  * @prop {string} reason Reason for verification status.
  * @prop {string|null} payload Payload for verification, can be null.
  * @prop {string|null} signature Signature of the commit, can be null.
 * 
 */
