package html

import (
	gmp "maragu.dev/gomponents"
	"maragu.dev/gomponents/components"
	ghtml "maragu.dev/gomponents/html"
)

func Home() gmp.Node {
	return components.HTML5(components.HTML5Props{
		Title: "Wordle Stats",
		Description: "Keep track of your wordle games by pasting in the share text",
		Head: []gmp.Node{
			ghtml.Script(ghtml.Src("/static/scripts/app.js"), ghtml.Defer()),
		},
		Body: []gmp.Node{
			ghtml.H1(gmp.Text("Wordle Stats")),
			ghtml.Button(gmp.Text("See Stats")),
			ghtml.H3(gmp.Text("Paste your share text here")),
			ghtml.Form(
				ghtml.ID("form"),
				ghtml.Action(""),
				ghtml.Method("GET"),
				ghtml.Div(ghtml.Textarea(ghtml.ID("sharetextarea"))),
				ghtml.Button(ghtml.Type("submit"), gmp.Text("Submit")),
			),
		},
	})
}