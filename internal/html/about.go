package html

import (
	gmp "maragu.dev/gomponents"
	"maragu.dev/gomponents/components"
	ghtml "maragu.dev/gomponents/html"
)

func About() gmp.Node {
	return components.HTML5(components.HTML5Props{
		Title: "Wordle Stats - ABout",
		Head: []gmp.Node{
			ghtml.Link(ghtml.Rel("stylesheet"), ghtml.Href("/static/styles/app.css")),
		},
		Body: []gmp.Node{
			ghtml.H1(gmp.Text("How Wordle Stats Works")),
			ghtml.Main(
				ghtml.H2(gmp.Text("Currently WIP")),
				ghtml.P(gmp.Text(`
					Wordle Stats allows you to paste in your Wordle share text each day. 
					It will then keep track of your stats in your browser's local storage, so you don't need an NYT Games account
					to view stats.
					If you change browser or device, you may lose all of this data, so there is also an option
					to download or upload a backup file of your wordle stats.
				`)),
			),
		},
	})
}