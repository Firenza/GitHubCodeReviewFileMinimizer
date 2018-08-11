# GitHubPullRequestEnhancer

![](https://user-images.githubusercontent.com/9145108/43986650-d1950aec-9cd9-11e8-8c71-ce3c448223c6.jpg)

#### Purpose

A Chrome extension meant to make managing GitHub pull requests easier via the following enhancements

##### Auto Collapsing File Diffs

Automatically minimizes code file content for files that don't generally need a review.  For example in .NET solutions generally you don't need to review changes to `.sln`, `.csproj`, `.vbproj`, or `package.config` files.  If the solution builds the content of these must be good enough :)

File diffs to collapse can be selected by a simple string contains or a regex match on the full file path

#### Usage

1. [Click here](https://chrome.google.com/webstore/detail/github-pull-request-enhan/fbcijinnjokkhnmeilacncmiafcgplph) to install the extension from the Chrome Store
2. Click the  ![](https://user-images.githubusercontent.com/9145108/43986713-4c6ac184-9cdb-11e8-9a6e-183c73baa2ac.jpg) button in Chrome
3. Enter some matching conditions
4. Naivgate to a Pull Request enjoy having less to read :)

#### Tech Used

* React
* [Material-UI React components](https://material-ui.com/)
* Webpack
* Google Analytics
* Visual Studio Code
