// Figure out whether or not the script is running in developer mode
// the 'update_url' manifest key is added when an extension is uploaded to the 
// chrome web store
const IS_DEV_MODE = !('update_url' in chrome.runtime.getManifest());
const logDev = (message) => {
    if (IS_DEV_MODE) {
        console.log(message);
    }
}

logDev("Executing Content Script");

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
            logDev("Mutation handler triggered");

            collapseDiffs();

            // There is only one delayed request to get more diff data so we only need
            // to watch for one mutation
            observer.disconnect();
        }
    });
}

let fileDifToCollapseRegex = undefined;

function collapseDiffs() {
    $('div .file-header').each(function (index) {
        let fileName = $(this).find('div.file-info').find('a').attr('title');

        if (fileDifToCollapseRegex !== undefined && fileDifToCollapseRegex.test(fileName)) {
            // Check to see if this diff has already been collapsed
            let $button = $(this).find('button');
            let isButtonInExpandedMode = $button.attr('aria-expanded');

            if (isButtonInExpandedMode) {

                // Directly doing the css updates that the button click does works more reliably that mimicing
                // a button click so do that
                $(this).parent().attr('class', 'file js-file js-details-container Details show-inline-notes js-transitionable open Details--on');
                $button.attr('aria-expanded', 'false');
            }
        }
    });
}

let key = "fileDiffToCollapseRegex";

chrome.storage.sync.get(key, (items) => {
    let fileDifToCollapseRegexString = items[key];

    if (fileDifToCollapseRegexString !== undefined) {
        fileDifToCollapseRegex = RegExp(fileDifToCollapseRegexString);
    }

    //For whatever reason the collapsing won't work unless there is a slight delay
    setTimeout(() => {
        collapseDiffs();
    }, 200);
});