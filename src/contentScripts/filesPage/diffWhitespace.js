import {logDev} from '../../common/logDev'

const additionDeletionsRegex = /(\d+) additions? & (\d+) deletions?/;

let getNumberOfWhitespaceDiffs = () => {
    let whitespaceDiffLines = 0;

    $('div.file').each((index, div) => {

        let diffMakeupText = $(div).find('span.diffstat').first().attr('aria-label')
        let match = additionDeletionsRegex.exec(diffMakeupText);
        let numAdditions = Number(match[1]);
        let numDeletinos = Number(match[2]);
        let numHunkHeaders = $(div).find('td.blob-code-hunk').length;
        let numExpanders = $(div).find('a.diff-expander').length;

        // Not sure if the expanders part of this is valid
        let isFileDeletionOrCreation = (numAdditions === 0 || numDeletinos === 0) && numHunkHeaders === 1 && numExpanders === 0

        if (!isFileDeletionOrCreation) {

             // Go through each diff marked as an addition
             $(div).find('td.blob-code.blob-code-addition').each((i, td) => {
                let codeSpan = $(td).children('span[class=blob-code-inner]')[0];

                if (IsDiffOnlyWhitespaceUpdates(codeSpan)) {
                    whitespaceDiffLines++;
                }
            });

            // Go through each diff marked as a deletion
            $(div).find('td.blob-code.blob-code-deletion').each((i, td) => {
                let codeSpan = $(td).children('span[class=blob-code-inner]')[0];

                // Parse the actual content of the diff to see if there are only newline / whitespace changes
                if (IsDiffOnlyWhitespaceUpdates(codeSpan)) {
                    whitespaceDiffLines++;
                }
            });
        }
    });

    return whitespaceDiffLines;
   
    function IsDiffOnlyWhitespaceUpdates(codeSpan) {
        let partialDifs = $(codeSpan).children('span.x.x-first.x-last')

        if (!_.isEmpty(partialDifs) && partialDifs.length > 0) {
            let whitespaceOnlyDiff = true;

            partialDifs.each((i, span2) => {
                if (span2.textContent.trim(" ") !== "") {
                    whitespaceOnlyDiff = false;
                }
            });

            if (whitespaceOnlyDiff) {
                return true;
            } else {
                return false;
            }

        }
    }
}

let insertWhitespaceDiffToggle = () => {

    var whiteSpaceToggle = document.getElementById("whiteSpaceToggle");

    if (whiteSpaceToggle) {
        logDev("Haltting insertion of whitespace toggle, element is already there");
        // If the element was already added then don't add it again. This code will be executed again
        // after the page is refreshed and the element removed.
        return;
    }

    let windowUrl = new URL(window.location.href);
    let whitespaceDiffsAreBeingShown = !windowUrl.searchParams.has('w');

    let githubWhitespaceDiffUrl = null;
    let ariaLabel = null;
    let buttonText = null;

    if (whitespaceDiffsAreBeingShown) {
        let numberOfWhitespaceDiffs = getNumberOfWhitespaceDiffs();
        windowUrl.searchParams.append('w', 1);
        ariaLabel = 'Hide whitespace only file differences';
        buttonText = `Hide whitespace diffs (${numberOfWhitespaceDiffs})`

    }else{
        windowUrl.searchParams.delete('w');
        ariaLabel = 'Show whitespace only file differences';
        buttonText = `Show whitespace diffs`;
    }

    let whiteSpaceToggleButton = `
        <div id="whiteSpaceToggle" class="diffbar-item">
        <div class="BtnGroup">     
            <a class="btn btn-sm btn-outline BtnGroup-item tooltipped tooltipped-s" href="${windowUrl}" aria-label="${ariaLabel}">${buttonText}</a>
        </div>
        </div>`
    
    $('div.float-right.pr-review-tools').prepend(whiteSpaceToggleButton);
}

export {insertWhitespaceDiffToggle};