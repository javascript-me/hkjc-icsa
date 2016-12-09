import React from 'react'

let globalPopupCmp = null

/*
* showCustom (options)
*							options {
*								title: string required
*								children: component instance required
*								confirmBtn: string optional
*								cancelBtn: string optional
*								onConfirm: func optional
*								onCancel: func optional
*							}
*/

export default {
	init (popupCmp) {
		globalPopupCmp = popupCmp
	},
	showCustom (options) {
		globalPopupCmp.setCustom(options)
		globalPopupCmp.show()
	},
	showMessageBox (msg, onConfirm, onCancel) {
		const children = (
			<div>{msg}</div>
		)

		if (!onConfirm) {
			onConfirm = () => {}
		}

		if (!onCancel) {
			onCancel = () => {}
		}

		this.showCustom({
			title: 'Message',
			children,
			onConfirm,
			onCancel
		})
	},
	showErrorBox () {
	}
}
