// Setup mutation observer
let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
let observer = new MutationObserver(mutationHandler);
let observerConfiguration = { childList: true, subtree: true };

// Watch the files element as this is the parent of all the file diff content
let nodeToWatch = document.getElementById('files');
observer.observe(nodeToWatch, observerConfiguration);

function mutationHandler(mutationRecords) {
    mutationRecords.forEach(function (mutation) {
        // Only care about this event of stuff got added
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {

            collapseDiffs();

            // There is only one delayed request to get more diff data so we only need
            // to watch for one mutation
            observer.disconnect();
        }
    });
}

let key = "fileDiffToCollapseRegex";
let fileDifToCollapseRegex = undefined;

chrome.storage.sync.get(key, (items) => {
    let fileDifToCollapseRegexString = items[key];

    if (fileDifToCollapseRegexString !== undefined){
        fileDifToCollapseRegex = RegExp(fileDifToCollapseRegexString);
    }
});

function collapseDiffs() {
    $('div .file-header').each(function (index) {
        let fileName = $(this).find('div.file-info').find('a').attr('title');

        if (fileDifToCollapseRegex !== undefined && fileDifToCollapseRegex.test(fileName)) {

            // Check to see if this diff has already been collapsed
            let $button = $(this).find('button');
            let isButtonInExpandedMode = $button.attr('aria-expanded');

            if (isButtonInExpandedMode) {
                $button.click();
            }
        }
    });
}

// Run this right away for the file diffs that were loaded with the page
collapseDiffs();