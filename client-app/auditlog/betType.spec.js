import React from 'react'
import { shallow } from 'enzyme'
import BetType from './betType'

const selectedBetTypeOfCaller = 'football'
const defaultBetType = 'football'
const anotherBetType = 'basketball'

describe('<BetType /> component', () => {
	it('will render an <i /> tag', () => {
		const betType = shallow(<BetType />)

		expect(betType.find('i')).to.have.length(1)
	})

	it('will use correct icon-* className by props.betType, e.g., * symbol will replace by props.betType ', () => {
		const betType = shallow(<BetType betType={defaultBetType} />)
		expect(betType.find('i').hasClass('icon-' + defaultBetType)).to.be.true
	})

	it('will have active className when props.betType equals selectedBetTypeOfCaller', () => {
		const betType = shallow(<BetType
			selectedBetType={selectedBetTypeOfCaller}
			betType={defaultBetType} />)

		expect(betType.find('i').hasClass('active')).to.be.true
	})

	it('will not have active className when props.betType equals selectedBetTypeOfCaller', () => {
		const betType = shallow(<BetType
			selectedBetType={selectedBetTypeOfCaller}
			betType={anotherBetType} />)
		expect(betType.find('i').hasClass('active')).to.be.false
	})

	it('will not trigger props.changeBetTypeEvent when clicked on it and props.betType equals props.selectedBetType', () => {
		const changeEvent = sinon.spy()
		const betType = shallow(<BetType
			selectedBetType={selectedBetTypeOfCaller}
			betType={defaultBetType}
			changeBetTypeEvent={changeEvent} />)

		betType.simulate('click')

		expect(changeEvent.called).to.be.false
	})

	it('will trigger props.changeBetTypeEvent with props.betType, when clicked on it and props.betType not equals props.selectedBetType', () => {
		const changeEvent = sinon.spy()
		const betType = shallow(<BetType
			selectedBetType={selectedBetTypeOfCaller}
			betType={anotherBetType}
			changeBetTypeEvent={changeEvent} />)

		betType.simulate('click')

		expect(changeEvent.getCall(0).args[0]).to.be.equal(anotherBetType)
	})
})
