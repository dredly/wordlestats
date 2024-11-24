package html

import (
	"strconv"

	gmp "maragu.dev/gomponents"
	"maragu.dev/gomponents/components"
	ghtml "maragu.dev/gomponents/html"
)

// numColumns is set to 8 to ensure the textarea is the right size for pasting the share text
// 1 header line + 1 blank line + up to 6 guesses
const numColumns = 8

var  guesses = []string{"1", "2", "3", "4", "5", "6", "X"}
var statisticLabels = []string{
	"Played",
	"Win %",
	"Current Streak",
	"Max Streak",
}

func Home() gmp.Node {
	return components.HTML5(components.HTML5Props{
		Title: "Wordle Stats",
		Description: "Keep track of your wordle games by pasting in the share text",
		Head: []gmp.Node{
			ghtml.Script(ghtml.Src("/static/scripts/app.js"), ghtml.Defer()),
			ghtml.Link(ghtml.Rel("stylesheet"), ghtml.Href("/static/styles/app.css")),
		},
		Body: []gmp.Node{
			ghtml.H1(gmp.Text("Wordle Stats")),
			ghtml.A(gmp.Text("About"), ghtml.Href("/about")),
			ghtml.Main(
				ghtml.H3(gmp.Text("Statistics")),
				ghtml.Div(
					ghtml.ID("statistics"),
					gmp.Map(statisticLabels, statistic),
				),
				ghtml.H3(gmp.Text("Guess Distribution")),
				ghtml.Div(
					ghtml.Class("guessdistribution"),
					ghtml.Div(
						ghtml.Class("guesslabels"),
						gmp.Map(guesses, guessLabel),
					),
					ghtml.Div(
						ghtml.Class("guessgraph"),
						gmp.Map(guesses, guessDistributionBar),
					),
				),
				ghtml.H3(gmp.Text("Paste your share text here")),
				ghtml.Form(
					ghtml.ID("form"),
					ghtml.Action(""),
					ghtml.Method("GET"),
					ghtml.Div(
						ghtml.Textarea(ghtml.ID("sharetextarea"), ghtml.Rows(strconv.Itoa(numColumns))),
					),
					ghtml.Button(ghtml.Type("submit"), gmp.Text("Submit")),
				),
			),
		},
	})
}

func statistic(text string) gmp.Node {
	return ghtml.Div(
		ghtml.Class("statistic"),
		ghtml.H2(ghtml.Class("statvalue"), gmp.Text("")),
		ghtml.P(gmp.Text(text)),
	)
}

func guessDistributionBar(guess string) gmp.Node {
	return ghtml.Div(
		ghtml.Class("guessbar"),
		baseGuessDistributionBar(guess),
		scalableGuessDistributionBar(guess),
	)
}

func baseGuessDistributionBar(guess string) gmp.Node {
	return ghtml.Div(
		ghtml.Class("guessbarbase"), 
		ghtml.P(ghtml.ID("guessbarbase" + guess), gmp.Text("0")),
	)
}

func scalableGuessDistributionBar(guess string) gmp.Node {
	return ghtml.Div(
		ghtml.ID("guessbarscalable" + guess), 
		ghtml.Class("guessbarscalable"),
		ghtml.P(ghtml.ID("guessbarscalablelabel" + guess), gmp.Text("")),
	)
}

func guessLabel(guess string) gmp.Node {
	return ghtml.Div(
		ghtml.Class("guesslabel"),
		ghtml.P(
			gmp.Text(guess),
		),
	)
}