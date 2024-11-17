const WORDLE_STATS_KEY = "wstats";
const LAUNCH_DATE = new Date(2021, 6, 19); // TODO: get the actual launch date

const results = getResults();
if (results) {
    populateGuessGraph(Object.values(results));
    populateStats(results);
}
document.querySelector("#form")?.addEventListener("submit", evt => handleSubmission(evt as SubmitEvent));

function getResults(): object | undefined {
    const currentStr = localStorage.getItem(WORDLE_STATS_KEY);
    if (!currentStr) {
        return;
    }
    return JSON.parse(currentStr);
}

function populateGuessGraph(results: string[]) {
    const resultQuantities = new Map<string, number>();
    let maxQuantity = 0;
    results.forEach(r => {
        const currentQuantity = resultQuantities.get(r);
        const newQuantity = currentQuantity ? currentQuantity + 1 : 1;
        resultQuantities.set(r, newQuantity);
        maxQuantity = Math.max(maxQuantity, newQuantity);
    });
    resultQuantities.forEach((quantity, res) => {
        const percent = (quantity / maxQuantity) * 100;
        const barElem = document.querySelector("#guessbarscalable" + res.split("/")[0]);
        if (!barElem) {
            throw new Error("Could not find bar element");
        }
        barElem.setAttribute("style", `width: ${percent}%;`);
        const baseLabel = document.querySelector("#guessbarbase" + res.split("/")[0]);
        if (!baseLabel) {
            throw new Error("Could not find base label");
        }
        baseLabel.textContent = "";
        const scalableLabel = document.querySelector("#guessbarscalablelabel" + res.split("/")[0]);
        if (!scalableLabel) {
            throw new Error("Could not find scalable label");
        }
        scalableLabel.textContent = String(quantity);
    })
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

function populateStats(results: object) {
    const total = Object.keys(results).length;
    const numWon = Object.values(results)
        .filter(r => (r as string) !== "X/6")
        .length;
    console.log("Total", total);
    console.log("Num Won", numWon);
    const days = Object.entries(results)
        .filter(entry => entry[1] !== "X/6")
        .map(entry => Number(entry[0]))
        .sort((a, b) => (a - b));
    const max = maxStreak(days);
    console.log("maxStreak", max);
}

function getResultWidth(result: string, elemWidth: number, resultRelativeWidths: Map<string, number>): number {
    const relWidth = resultRelativeWidths.get(result);
    return relWidth ? relWidth * elemWidth : 0;
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

function maxStreak(daysSorted: number[]): number {
    let max = 1;
    let currentStreak = 1;
    for (let i = 1; i < daysSorted.length; i++) {
        const prev = daysSorted[i - 1];
        const curr = daysSorted[i];
        if (curr - prev === 1) {
            currentStreak++;
            max = Math.max(max, currentStreak);
        } else {
            currentStreak = 1;
        }
    }
    return max;
}

type DayResult = {
    day: number,
    result: string
}