// Figure out whether or not the script is running in developer mode
// the 'update_url' manifest key is added when an extension is uploaded to the 
// chrome web store
let IS_DEV_MODE = !('update_url' in chrome.runtime.getManifest());
let logDev = (message) => {
    if (IS_DEV_MODE) {
        console.log(message);
    }
}

export {logDev}