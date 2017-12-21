# GitHubPullRequestEnhancer

A Chrome extension meant to make managing GitHub pull requests easier via the following enhancements

#### Auto Collapsing File Diffs

Automatically minimizes code file content for files that don't generally need a review.  For example in .NET solutions generally you don't need to review changes to `.sln`, `.csproj`, `.vbproj`, or `package.config` files.  If the solution builds the content of these must be good enough :)

A user defined regex value is used to pick which file diffs to collapse

## Usage

1. [Click here](https://chrome.google.com/webstore/detail/github-pull-request-enhan/fbcijinnjokkhnmeilacncmiafcgplph) to download the extension from the Chrome Store
1. Click the  ![](https://github.com/Firenza/GitHubPullRequestEnhancer/blob/master/PR_16x16.png) button in Chrome
2. Enter a regex pattern for the files diffs you want to automatically collapse.  For .NET repos you can use the following regex pattern to start `\.csproj|\.vbproj|\.sln|packages\.config`
3. Naivgate to a Pull Request enjoy how much easier dealing with it is :)
