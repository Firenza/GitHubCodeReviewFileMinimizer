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
                eventAction: 'file diff setting triggered',
                eventLabel: request.payload.diffSettingThatMatched.matchType + ' | ' + request.payload.diffSettingThatMatched.matchString,
                dimension1: request.payload.diffSettingThatMatched.matchType,
                dimension2: request.payload.diffSettingThatMatched.matchString,
                metric1: request.payload.linesInDiff
            });
        }

        if (request.type === 'diffConditionDeleted') {
            ga('send', 'event', {
                eventCategory: 'File Diff Interaction',
                eventAction: 'delete condition click',
                eventLabel: request.payload.diffToDelete.matchType + ' | ' + request.payload.diffToDelete.diffToDelete.matchString,
                dimension1: request.payload.diffToDelete.diffToDelete.matchtype,
                dimension2: request.payload.diffToDelete.diffToDelete.matchString
            });
        }

        if (request.type === 'diffConditionAdded') {
            ga('send', 'event', {
                eventCategory: 'File Diff Interaction',
                eventAction: 'add new condition click'
            });
        }

        if (request.type === 'diffConditionUpdated') {
            ga('send', 'event', {
                eventCategory: 'File Diff Interaction',
                eventAction: 'add new condition click'
            });
        }

        if (request.type === 'extensionUILoaded') {
            // Log that someone opened the extension UIs
            ga('send', 'pageview', '/index.html');
        }
    }  
);

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if (changeInfo.status === "complete" && pullRequestFilePageUrlRegex.test(tab.url)) {
            try {
                chrome.tabs.executeScript(null, {file: "lodash.min.js"});
                chrome.tabs.executeScript(null, {file: "jquery.min.js"});
                chrome.tabs.executeScript(null, {file: "contentscript.js"});
            } catch (error) {
                ga('send', 'exception', {
                    'exDescription': error.message,
                    'exFatal': true
                });

                throw error;
            }
        }
});