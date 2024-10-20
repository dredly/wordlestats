const WORDLE_STATS_KEY = "wstats";

document.querySelector("#form").addEventListener("submit", evt => handleSubmission(evt));

function handleSubmission(evt) {
    evt.preventDefault();
    const shareText = evt.srcElement.sharetextarea.value;
    const { day, result } = parseShareText(shareText);
    saveResult(day, result);
    window.location = evt.srcElement.action;
}

function parseShareText(shareText) {
    const firstLine = shareText.split("\n")[0];
    parts = firstLine.split(" ", 3);
    const day = Number(parts[1].replace(",", ""));
    const result = parts[2];
    return { day, result };
}

function saveResult(day, result) {
    const currentStr = localStorage.getItem(WORDLE_STATS_KEY);
    if (!currentStr) {
        console.log("No wordle stats currently in local storage");
        localStorage.setItem(WORDLE_STATS_KEY, "{}");
        saveResult(day, result);
        return;
    }
    const stats = JSON.parse(currentStr);
    stats[day] = result;
    localStorage.setItem(WORDLE_STATS_KEY, JSON.stringify(stats));
}