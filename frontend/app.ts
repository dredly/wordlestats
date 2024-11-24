const WORDLE_STATS_KEY = "wstats";
const LAUNCH_DATE = new Date(2021, 5, 19);
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

const results = getResults();
if (results) {
    populateGuessGraph(Object.values(results));
    populateStats(calculateStats(results));
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

function populateStats(stats: number[]) {
    const statValueElems = document.querySelectorAll(".statvalue");
    statValueElems.forEach((elem, idx) => {
        elem.textContent = String(stats[idx]);
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

// returns stats in the following order: Played, Win %, Current Streak, Max Streak 
function calculateStats(results: object): number[] {
    const total = Object.keys(results).length;
    const wonDays = Object.entries(results)
        .filter(entry => entry[1] !== "X/6")
        .map(entry => Number(entry[0]))
        .sort((a, b) => (a - b));
    const numWon = wonDays.length;
    const winPercent = Math.round((numWon / total) * 100);
    const max = maxStreak(wonDays);
    const latestWordleDay = daysBetween(LAUNCH_DATE, new Date());
    const currStreak = currentStreak(wonDays, latestWordleDay);
    return [total, winPercent, currStreak, max];
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

function maxStreak(daysWonSorted: number[]): number {
    let max = 1;
    let currentStreak = 1;
    for (let i = 1; i < daysWonSorted.length; i++) {
        const prev = daysWonSorted[i - 1];
        const curr = daysWonSorted[i];
        if (curr - prev === 1) {
            currentStreak++;
            max = Math.max(max, currentStreak);
        } else {
            currentStreak = 1;
        }
    }
    return max;
}

function currentStreak(daysWonSorted: number[], latestWordleDay: number): number {
    console.log("daysWonSorted", daysWonSorted);
    console.log("latestWordleDay", latestWordleDay);
    if (!daysWonSorted.length) {
        return 0;
    }
    if (![latestWordleDay, latestWordleDay -1].includes(daysWonSorted[daysWonSorted.length - 1])) {
        return 0;
    }
    const daysReversed = daysWonSorted.reverse();
    let streak = 1;
    for (let i = 1; i < daysReversed.length; i++) {
        const prev = daysReversed[i - 1];
        const curr = daysReversed[i];
        if (prev - curr === 1) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

function daysBetween(start: Date, end: Date): number {
    // A day in UTC always lasts 24 hours (unlike in other time formats)
    const startUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    const endUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  
    // so it's safe to divide by 24 hours
    return (startUTC - endUTC) / ONE_DAY_IN_MS;
  }

type DayResult = {
    day: number,
    result: string
}