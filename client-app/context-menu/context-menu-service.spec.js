import sinon from 'sinon'
import ContextMenuService from './context-menu-service'

describe('ContextMenuService', () => {
	it('should call show and pass options, if initialized', () => {
		let comp = { show: sinon.spy() }
		ContextMenuService.init(comp)

		let options = {dummy: 'data', items: []}
		ContextMenuService.show(options)

		expect(comp.show.calledWith(options)).to.be.true
	})
})
