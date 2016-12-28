import React from 'react'

let globalContextMenu = null

export default {
	init (component) {
		globalContextMenu = component
	},

	show (options) {
		if (!globalContextMenu) {
			return
		}
		globalContextMenu.show(options)
	}
}
