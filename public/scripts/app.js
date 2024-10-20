var _a;
var WORDLE_STATS_KEY = "wstats";
(_a = document.querySelector("#form")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", function (evt) { return handleSubmission(evt); });
function handleSubmission(evt) {
    var _a;
    evt.preventDefault();
    console.log(document.querySelector("#sharetextarea"));
    var shareText = (_a = document.querySelector("#sharetextarea")) === null || _a === void 0 ? void 0 : _a.textContent;
    if (!shareText) {
        console.error("Could not find shareTextArea");
        return;
    }
    var _b = parseShareText(shareText), day = _b.day, result = _b.result;
    saveResult(day, result);
    window.location.reload();
}
function parseShareText(shareText) {
    var firstLine = shareText.split("\n")[0];
    var parts = firstLine.split(" ", 3);
    var day = Number(parts[1].replace(",", ""));
    var result = parts[2];
    return { day: day, result: result };
}
function saveResult(day, result) {
    var currentStr = localStorage.getItem(WORDLE_STATS_KEY);
    if (!currentStr) {
        console.log("No wordle stats currently in local storage");
        localStorage.setItem(WORDLE_STATS_KEY, "{}");
        saveResult(day, result);
        return;
    }
    var stats = JSON.parse(currentStr);
    stats[day] = result;
    localStorage.setItem(WORDLE_STATS_KEY, JSON.stringify(stats));
}
