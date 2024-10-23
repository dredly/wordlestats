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
    const resultRelativeWidths = new Map<string, number>();
    resultQuantities.forEach((quantity, res) => {
        resultRelativeWidths.set(res, quantity / maxQuantity);
    })
    const guessGraphElem = document.querySelector(".guessgraph");
    if (!guessGraphElem) {
        console.error("could not find guess graph elem");
        return;
    }
    const elemWidth = guessGraphElem.clientWidth;
    const resultWidths = {
        "1": getResultWidth("1/6", elemWidth, resultRelativeWidths),
        "2": getResultWidth("2/6", elemWidth, resultRelativeWidths),
        "3": getResultWidth("3/6", elemWidth, resultRelativeWidths),
        "4": getResultWidth("4/6", elemWidth, resultRelativeWidths),
        "5": getResultWidth("5/6", elemWidth, resultRelativeWidths),
        "6": getResultWidth("6/6", elemWidth, resultRelativeWidths),
        "X": getResultWidth("X/6", elemWidth, resultRelativeWidths),
    }
    console.log("resultWidths", resultWidths);

    Object.keys(resultWidths).forEach(k => {
        const barElem = document.querySelector("#guessbar" + k);
        if (!barElem) {
            throw new Error("Could not find bar element");
        }
        const width = resultWidths[k as NumGuesses];
        barElem.setAttribute("style", `width: ${width}px;`)
    })
}

function getResultWidth(result: string, elemWidth: number, resultRelativeWidths: Map<string, number>): number {
    const relWidth = resultRelativeWidths.get(result);
    return relWidth ? relWidth * elemWidth : 0;
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

type NumGuesses = "1" | "2" | "3" | "4" | "5" | "6" | "X"