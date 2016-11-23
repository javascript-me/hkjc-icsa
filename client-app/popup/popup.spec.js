import Helper from './testHelper'
import React from 'react'
import { expect } from 'chai'
import Popup from './index.js'

let rendered

describe('The Popup component', () => {
	it('will not render initially', () => {
		rendered = new Helper(<Popup />)

		expect(rendered.isOpen()).to.be.false
	})

	// it('will render on show()', () => {
	// 	rendered = new Helper(<Popup />)
	// 	rendered.show()

	// 	expect(rendered.isOpen()).to.be.true
	// })

	// it('will hide on hide()', () => {
	// 	rendered = new Helper(<Popup />)
	// 	rendered.show()
	// 	rendered.hide()
	// 	expect(rendered.isOpen()).to.be.false
	// })

	// it('will emit beforeOpen and afterOpen events when opening', () => {
	// 	let beforeTriggered = false
	// 	let afterTriggered = false
	// 	const onBefore = () => (beforeTriggered = true)
	// 	const onAfter = () => {
	// 		expect(beforeTriggered).to.be.true
	// 		afterTriggered = true
	// 	}
	// 	rendered = new Helper(<Popup beforeOpen={onBefore} afterOpen={onAfter} />)

	// 	expect(beforeTriggered).to.be.false
	// 	expect(afterTriggered).to.be.false
	// 	rendered.show()
	// 	expect(beforeTriggered).to.be.true
	// 	expect(afterTriggered).to.be.true
	// })

	// it('will emit beforeClose and afterClose events when closing', () => {
	// 	let beforeTriggered = false
	// 	let afterTriggered = false
	// 	const onBefore = () => (beforeTriggered = true)
	// 	const onAfter = () => {
	// 		expect(beforeTriggered).to.be.true
	// 		afterTriggered = true
	// 	}
	// 	rendered = new Helper(<Popup beforeClose={onBefore} afterClose={onAfter} />)
	// 	rendered.show()

	// 	expect(beforeTriggered).to.be.false
	// 	expect(afterTriggered).to.be.false
	// 	rendered.hide()
	// 	expect(beforeTriggered).to.be.true
	// 	expect(afterTriggered).to.be.true
	// })

	// it('will emit an onOverlayClicked event', () => {
	// 	let clicked = false
	// 	rendered = new Helper(
	// 		<Popup onOverlayClicked={() => (clicked = true)} />
	// 	)
	// 	rendered.show()
	// 	rendered.clickOnOverlay()
	// 	expect(clicked).to.be.true
	// 	expect(rendered.isOpen()).to.be.true
	// })

	// it('will close when the overlay is clicked when hideOnOverlayClicked prop is true', () => {
	// 	rendered = new Helper(<Popup hideOnOverlayClicked />)
	// 	rendered.show()
	// 	rendered.clickOnOverlay()
	// 	expect(rendered.isOpen()).to.be.false
	// })

	// it('will hide when the close button is clicked', () => {
	// 	rendered = new Helper(<Popup />)
	// 	rendered.show()
	// 	rendered.clickOnClose()
	// 	expect(rendered.isOpen()).to.be.false
	// })
})
