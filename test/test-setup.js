import {expect} from 'chai'
import sinon from 'sinon'
import jsdom from 'jsdom'

global.expect = expect

global.sinon = sinon

global.navigator = {
	userAgent: 'node.js'
}

global.jsdom = (body = '') => { // TODO FIXME (AVOID!!!)
	global.document = jsdom.jsdom(arguments)
	global.window = document.defaultView
	global.$ = global.jQuery = require('jquery')
	return document
}

global.waitFor = (fn) => {
	return async (done) => {
		try {
			await fn()
			done()
		} catch (err) {
			done(err)
		}
	}
}

global.responseJson = (response, code = 200) => {
	return [code, { 'Content-Type': 'application/json' }, JSON.stringify(response)]
}

const rewires = []
global.rewire = (revert) => {
	if (revert) {
		rewires.push(revert)
	} else {
		for (let rewireRevert of rewires) {
			rewireRevert()
		}
		rewires.length = 0
	}
}
