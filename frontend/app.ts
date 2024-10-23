const WORDLE_STATS_KEY = "wstats";

populateGuessGraph();
document.querySelector("#form")?.addEventListener("submit", evt => handleSubmission(evt as SubmitEvent));

function populateGuessGraph() {
    const currentStr = localStorage.getItem(WORDLE_STATS_KEY);
    if (!currentStr) {
        return;
    }
    const dayResults: object = JSON.parse(currentStr);
    const results = Object.values(dayResults) as string[];
    const resultQuantities = new Map<string, number>();
    let maxQuantity = 0;
    results.forEach(r => {
        const currentQuantity = resultQuantities.get(r);
        const newQuantity = currentQuantity ? currentQuantity + 1 : 1;
        resultQuantities.set(r, newQuantity);
        maxQuantity = Math.max(maxQuantity, newQuantity);
    });
    console.log("resultQuantities", resultQuantities);
    console.log("maxQuantity", maxQuantity);
}

function handleSubmission(evt: SubmitEvent) {
    evt.preventDefault();
    const shareTextArea = document.querySelector("#sharetextarea");
    if (!shareTextArea) {
        console.error("Could not find shareTextArea");
        return;
    }
    const shareText = (shareTextArea as HTMLTextAreaElement).value;
    const { day, result } = parseShareText(shareText);
    saveResult(day, result);
    window.location.reload();
}

function parseShareText(shareText: string): DayResult {
    const firstLine = shareText.split("\n")[0];
    const parts = firstLine.split(" ", 3);
    const day = Number(parts[1].replace(",", ""));
    const result = parts[2];
    return { day, result };
}

function saveResult(day: number, result: string) {
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

type DayResult = {
    day: number,
    result: string
}