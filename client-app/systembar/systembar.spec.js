import Systembar from './systembar'

describe('<Systembar />', () => {
	it('send the request to get time', () => {
		const getTime = sinon.stub().returns({})
		rewire(Systembar.__set__('SystembarService', {getClock: getTime}))

		const getClock = Systembar.__get__('getClock')

		getClock()

		rewire()
		expect(getTime.calledOnce).to.be.true
	})
})
