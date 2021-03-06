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

	// emulate local/sessionStorage, cause it's not done in the jsdom
	global.window.localStorage = global.window.sessionStorage = {
		storage: {},
		getItem (key) {
			return this.storage[key]
		},
		setItem (key, value) {
			this.storage[key] = value
		},
		clear () {
			this.storage = {}
		}
	}

	return document
}

global.jsdom() // When I (binghu) removed this invoke from my test file, I found some other test need $, so I had to add this code. Pls fix me

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
global.rewireKeyVal = (target, key, val) => {
	rewire(target.__set__(key, val))
}
global.rewireResponse = (target, key, response) => {
	rewireKeyVal(target, key, () => {
		return Promise.resolve(response)
	})
}
global.rewireReject = (target, key, reason) => {
	rewireKeyVal(target, key, () => {
		return Promise.reject(reason)
	})
}
global.rewireService = (target, service, func, response) => {
	rewireKeyVal(target, service, {
		[func]: () => {
			return Promise.resolve(response)
		}
	})
}
global.rewireServiceReject = (target, service, func, reason) => {
	rewireKeyVal(target, service, {
		[func]: () => {
			return Promise.resolve(reason)
		}
	})
}
