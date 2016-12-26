import React from 'react'

let globalPopupCmp = null

/*
* showCustom (options)
*							options {
*								title: string required
*								children: ReactElement required
*								confirmBtn: string optional
*								cancelBtn: string optional
*								showCancel: bool optional
*								onConfirm: func optional
*								onCancel: func optional
*							}
*/

export default {
	cancelMesg: 'Are you sure you want to cancel the current operation?',
	updateMesg: 'Are you sure you want to proceed the operation?',
	resetMesg: 'Are you sure you want to discard your inputted information?',
	deleteMesg: 'Are you sure you want to delete the information?',

	init (popupCmp) {
		globalPopupCmp = popupCmp
	},
	showCustom (options) {
		if (!globalPopupCmp) {
			return
		}
		globalPopupCmp.setCustom(options)
		globalPopupCmp.show()
	},
	showMessageBox (msg, onConfirm, onCancel) {
		const children = (
			<div className='msg'>
				<p>{msg}</p>
			</div>
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
	showSuggestBox (type, msg, onConfirm) {
		let isSelectOption = {}
		switch (type) {
		case ('warnning') : { isSelectOption = {title: 'Warnning', textClass: 'msg msgErr'} } break
		case ('error') : { isSelectOption = {title: 'Error', textClass: 'msg msgErr'} } break
		case ('success') : { isSelectOption = {title: 'Success', textClass: 'msg'} } break
		}
		const children = (
			<div className={isSelectOption.textClass}>
				<p>{msg}</p>
			</div>
		)

		if (!onConfirm) {
			onConfirm = () => {}
		}

		this.showCustom({
			title: isSelectOption.title,
			confirmBtn: 'Close',
			children,
			showCancel: false,
			onConfirm
		})
	}
}
