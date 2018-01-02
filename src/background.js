import * as _ from 'lodash';

var pullRequestFilePageUrlRegex = new RegExp('github[^\/]*\/[^\/]+\/[^\/]+\/pull\/[^\/]+\/files');

// Load the google analytics code
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

// Create our tracker
ga('create', 'UA-36364890-2', 'auto');
// Disable this check so requests from the chrome-extension:// host get sent
ga('set', 'checkProtocolTask', function(){ /* nothing */ });

let debouncedDiffConditionChangeHandlers = [];

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if (request.type === "diffCollapsed"){
            let label = request.payload.diffSettingThatMatched.matchType;

            if (request.payload.diffSettingThatMatched.matchString && request.payload.diffSettingThatMatched.matchString.trim()) {
                label += " | " + request.payload.diffSettingThatMatched.matchString
            }

            ga('send', 'event', {
                eventCategory: 'File Diff Collapse',
                eventAction: 'file diff setting triggered',
                eventLabel: label,
                dimension1: request.payload.diffSettingThatMatched.matchType,
                dimension2: request.payload.diffSettingThatMatched.matchString,
                metric1: request.payload.linesInDiff
            });
        }

        if (request.type === 'diffConditionDeleted') {
            let label = request.payload.diffToDelete.matchType;

            if (request.payload.diffToDelete.matchString && request.payload.diffToDelete.matchString.trim()) {
                label += " | " + request.payload.diffToDelete.matchString
            }

            ga('send', 'event', {
                eventCategory: 'File Diff Interaction',
                eventAction: 'condition deleted',
                eventLabel: label,
                dimension1: request.payload.diffToDelete.matchtype,
                dimension2: request.payload.diffToDelete.matchString
            });
        }

        if (request.type === 'diffConditionAdded') {
            ga('send', 'event', {
                eventCategory: 'File Diff Interaction',
                eventAction: 'condition added'
            });
        }

        if (request.type === 'diffConditionUpdated') {
            let diffConditionId = request.payload.updatedDiffCondition.id;

            let deboundedDiffConditionHandler = debouncedDiffConditionChangeHandlers[diffConditionId]

            if (!deboundedDiffConditionHandler) {
                deboundedDiffConditionHandler = _.debounce((updatedDiffCondition) => {

                    let label = updatedDiffCondition.matchType;

                    if (updatedDiffCondition.matchString && updatedDiffCondition.matchString.trim()) {
                        label += " | " + updatedDiffCondition.matchString
                    }

                    ga('send', 'event', {
                        eventCategory: 'File Diff Interaction',
                        eventAction: 'condition updated',
                        eventLabel: updatedDiffCondition.matchType + ' | ' + updatedDiffCondition.matchString,
                        dimension1: updatedDiffCondition.matchType,
                        dimension2: updatedDiffCondition.matchString
                    });
                }, 2000);

                // Store a seperate debounced method for each condition so no updates are sent to google analtyics
                // until any given field stays unchanged for the debounce period.  The debounce period for saving the 
                // updated data needs to be short to make sure the data is saved before the extension UI is closed which 
                // means if we sent data to google analtyics without an additional delay a lot of uneeded data would be sent
                debouncedDiffConditionChangeHandlers[diffConditionId] = deboundedDiffConditionHandler;
            }

            deboundedDiffConditionHandler(request.payload.updatedDiffCondition);
        }

        if (request.type === 'externalNavigationRequested') {
    
            ga('send', 'event', {
                eventCategory: 'Outbound Link',
                eventAction: 'click',
                eventLabel: request.payload.url,
            });

            chrome.tabs.create({ url: request.payload.url });
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
                chrome.tabs.executeScript(null, {file: "content_bundle.js"});
            } catch (error) {
                ga('send', 'exception', {
                    'exDescription': error.message,
                    'exFatal': true
                });

                throw error;
            }
        }
});