// Execute everything in the function so the variables don't have a lifetime outside 
// the script invocation
(function () {
    const fileDiffCollapseSettingsStorageKey = "fileDiffToCollapseSettings";
    
    // Figure out whether or not the script is running in developer mode
    // the 'update_url' manifest key is added when an extension is uploaded to the 
    // chrome web store
    let IS_DEV_MODE = !('update_url' in chrome.runtime.getManifest());
    let logDev = (message) => {
        if (IS_DEV_MODE) {
            console.log(message);
        }
    }

    let fileDiffCollapseSettings = null;

    logDev("Executing Content Script");

    let fileDiffsContainer = document.getElementById('files');

    // If the page does not have the file dif container then the URL change must have triggered
    // this script to run before the request to get the data came back and or the DOM rendered.
    // In this case we can just bail out of the script since it should get triggered again once
    // the page is fully rendered.
    if (fileDiffsContainer !== null) {
       
        let mutationHandler = (mutationRecords) => {
            logDev("Mutation handler triggered");

            mutationRecords.forEach(function (mutation) {
                // Only care about this event if stuff got added to the DOM and the target was the diff container
                if (mutation.type === "childList"  && $(mutation.target).hasClass('js-diff-progressive-container') && mutation.addedNodes.length > 0) {
                    logDev("Mutation logic executing");

                    collapseDiffs(fileDiffCollapseSettings);

                    // There is only one delayed request to get more diff data so we only need
                    // to watch for one mutation
                    observer.disconnect();

                    logDev("Done executing mutation logi");
                }
            });
        }

        let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        let observer = new MutationObserver(mutationHandler);
        let observerConfiguration = { childList: true, subtree: true };

        // Watch for any changes to the file diff content that may come from ajax requests
        // spawned on PR's with a lot of file changed
        observer.observe(fileDiffsContainer, observerConfiguration);

        let fileDifToCollapseRegex = undefined;

        function collapseDiffs(fileDiffCollapseSettings) {
            logDev('Collapsing Diffs');
            $('div .file-header').each(function (index) {
                let fileName = $(this).find('div.file-info').find('a').attr('title');
                let diffSettingThatMatched = null;

                let fileMatch = fileDiffCollapseSettings.some((fileDiffCollapseSetting, index, array) => {
                    if (fileDiffCollapseSetting.matchType == "Contains") {
                        diffSettingThatMatched = fileDiffCollapseSetting;
                       
                        return fileName.indexOf(fileDiffCollapseSetting.matchString) >= 0
                    }
                    else if (fileDiffCollapseSetting.matchType == "Matches Regex") {
                        diffSettingThatMatched = fileDiffCollapseSetting;
                       
                        let regex = new RegExp(fileDiffCollapseSetting.matchString);
                        return regex.test(fileName);
                    }
                });

                if (fileMatch) {
                    // Check to see if this diff has already been collapsed
                    let $button = $(this).find('button');
                    let isButtonInExpandedMode = $button.attr('aria-expanded');

                    if (isButtonInExpandedMode) {

                        chrome.runtime.sendMessage({type: "diffCollapsed", payload: diffSettingThatMatched});

                        // Directly doing the css updates that the button click does works more reliably that mimicing
                        // a button click so do that
                        $(this).parent().attr('class', 'file js-file js-details-container Details show-inline-notes js-transitionable open Details--on');
                        $button.attr('aria-expanded', 'false');
                    }
                }
            });
        }

        chrome.storage.sync.get(fileDiffCollapseSettingsStorageKey, (items) => {
            fileDiffCollapseSettings = items[fileDiffCollapseSettingsStorageKey];

            collapseDiffs(fileDiffCollapseSettings);

            logDev('Done collapsing diffs, exiting content script');
        });
    }
    else{
        logDev('File container not found, existing content script')
    }
})();