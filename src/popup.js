let key = "fileDiffToCollapseRegex";

chrome.storage.sync.get(key, (items) => {
  let fileDifToCollapseRegexString = items[key];
  var input = document.getElementById('fileRegexInput');
  input.value = fileDifToCollapseRegexString;
});

document.addEventListener('DOMContentLoaded', () => {

  var input = document.getElementById('fileRegexInput');

  input.addEventListener('change', () => {
    var items = {};
    items[key] = input.value;

    chrome.storage.sync.set(items, function () {
      console.log("fileDifRegex update stored");
    });
  });
});