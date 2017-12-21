# GitHubPullRequestEnhancer

A Chrome extension meant to make managing GitHub pull requests easier via the following enhancements

#### Auto Collapsing File Diffs

Automatically minimizes code file content for files that don't generally need a review.  For example in .NET solutions generally you don't need to review changes to `.sln`, `.csproj`, `.vbproj`, or `package.config` files.  If the solution builds the content of these must be good enough :)

A user defined regex value is used to pick which file diffs to collapse
