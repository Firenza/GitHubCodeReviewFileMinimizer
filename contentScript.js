var targetNodes = $(".repository-content");
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var myObserver = new MutationObserver(mutationHandler);
var obsConfig = { childList: true,  subtree: true };
var inMutation = false;


//--- Add a target node to the observer. Can only add one node at a time.
targetNodes.each(function () {
    myObserver.observe(this, obsConfig);
});

function mutationHandler(mutationRecords) {
    
    console.info("mutationHandler:");
    console.log("in Mutation = " + inMutation);
    inMutation = true;

    mutationRecords.forEach(function (mutation) {
        
        if (mutation.type == "childList") {
            if (typeof mutation.addedNodes == "object") {
                debugger;
                //console.log(JSON.stringify(mutation.addedNodes));

                console.log(mutation.addedNodes);
               // console.log("SOME " + _.some(mutation.addedNodes, '#text'));

                mutation.addedNodes.forEach(element => {
                    console.log(Object.keys(element).length)
                    console.log(Object.getOwnPropertyNames(element));
                    console.log(typeof element);
                    console.log(element.toString());
                    console.log(element.id);
                    console.log(Object.values(element));
                    console.log(JSON.stringify(element));
                });

                console.log($(mutation.addedNodes).first())
                console.log($(mutation.addedNodes).find('text'));
                
                if ($(mutation.addedNodes).find('text').length){
                    collapseDiffs();
                }
            }
        }
    });

    inMutation = false;
}

function collapseDiffs() {


    $('div .file-header').each(function (index) {

        let fileName = $(this).find('div.file-info').find('a').attr('title');
        console.log(fileName);

        if (fileName.endsWith('.csproj') || fileName.endsWith('.sln') || fileName.endsWith('packages.config')) {
            // Check to see if this diff has already been collapsed
            let $button = $(this).find('button');
            let isButtonInExpandedMode = $button.attr('aria-expanded');

            if (isButtonInExpandedMode){
                console.log('clicking button');
                $button.click();
            }
        }

    });
}
