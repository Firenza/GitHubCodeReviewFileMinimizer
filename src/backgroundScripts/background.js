import * as analytics from './googleAnaltyics';

analytics.initialize();
analytics.addChromeMessageEventHandlers();

var pullRequestFilePageUrlRegex = new RegExp('github[^\/]*\/[^\/]+\/[^\/]+\/pull\/[^\/]+\/files');

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if (changeInfo.status === "complete" && pullRequestFilePageUrlRegex.test(tab.url)) {
            try {
                chrome.tabs.executeScript(null, {file: "filesPageContent_bundle.js"});
            } catch (error) {
                ga('send', 'exception', {
                    'exDescription': error.message,
                    'exFatal': true
                });

                throw error;
            }
        }
});