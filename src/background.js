var pullRequestFilePageUrlRegex = new RegExp('github[^\/]*\/[^\/]+\/[^\/]+\/pull\/[^\/]+\/files');

// Load the google analytics code
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics_debug.js','ga');

// Create our tracker
ga('create', 'UA-36364890-2', 'auto');
// Disable this check so requests from the chrome-extension:// host get sent
ga('set', 'checkProtocolTask', function(){ /* nothing */ });

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

      if (request.type === "diffCollapsed"){
            ga('send', 'event', {
                eventCategory: 'File Diff Collapse',
                eventAction: 'collapse file diff',
                eventLabel: request.payload.matchType + ' | ' + request.payload.matchString
            });
       }
    });

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && pullRequestFilePageUrlRegex.test(tab.url)) {
        chrome.tabs.executeScript(null, {file: "jquery.min.js"});
        chrome.tabs.executeScript(null, {file: "contentscript.js"});
    }
});