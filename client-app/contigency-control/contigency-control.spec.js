import React from 'react'
import {shallow} from 'enzyme'
import ContingencyControl from './contigency-control'

describe('<ContingencyControl>', () => {
	it('.hkjc-breadcrumb has text As "Home \\ Global Tools & Adminstration"', () => {
		const contingency = shallow(<ContingencyControl />)
		let breadcrumb = contingency.find('.hkjc-breadcrumb').text()
		expect(breadcrumb).to.equal('Home \\ Global Tools & Adminstration ')
	})
	it('h1 has ttile as "Contingency Control"', () => {
		const contingency = shallow(<ContingencyControl />)
		let pageTitle = contingency.find('h1').text()
		expect(pageTitle).to.equal('Contingency Control')
	})

	it('Page should have 3 sports icons i-e horse, football and basketball', () => {
		const contingency = shallow(<ContingencyControl />)
		let sportsIcons = contingency.find('.container-icon')
		expect(sportsIcons).to.have.length(3)
	})

	it('Page should have 6 big buttons as <ContigencyButton/>', () => {
		const contingency = shallow(<ContingencyControl />)
		expect(contingency.find('.big-button')).to.have.length(6)
	})

	it('Page should have 4 columns as col-md-3', () => {
		const contingency = shallow(<ContingencyControl />)
		expect(contingency.find('.col-md-3')).to.have.length(4)
	})

	it('Page should have 6 sub titles', () => {
		const contingency = shallow(<ContingencyControl />)
		expect(contingency.find('.sub-title')).to.have.length(6)
	})
})
describe('Click on big buttons', () => {
	it('stopSellAllClickHandler()', () => {
		const contingency = shallow(<ContingencyControl />)
		const SELECTED_COLOR = '#E25854'
		contingency.instance().stopSellAllClickHandler()

		expect(contingency.state('paragraphOne')).to.equal('STOP SELL ALL')
		expect(contingency.state('paragraphTwo')).to.equal('All Fixed Odds Sports, Pari-Mutuel Sports and Fixed Odds Horse Racing Will Be Stopped.')
		expect(contingency.state('showProceedPopup')).to.equal('block')

		expect(contingency.state('stopSellAllBackground')).to.equal(SELECTED_COLOR)
		expect(contingency.state('stopSellFixedODDSBackground')).to.equal(SELECTED_COLOR)
		expect(contingency.state('fixedOddFootBallBackground')).to.equal(SELECTED_COLOR)
		expect(contingency.state('fixedOddBasketBallBackground')).to.equal(SELECTED_COLOR)
		expect(contingency.state('fixedOddHorseRacingBackground')).to.equal(SELECTED_COLOR)
		expect(contingency.state('stopSelPariMutuelBackground')).to.equal(SELECTED_COLOR)
	})
	it('stopSellAllFixedOddsClickHandler()', () => {
		const contingency = shallow(<ContingencyControl />)
		const SELECTED_COLOR = '#E25854'
		contingency.instance().stopSellAllFixedOddsClickHandler()
		expect(contingency.state('paragraphOne')).to.equal('STOP SELL ALL FIXED ODDS')
		expect(contingency.state('paragraphTwo')).to.equal('All Fixed Odds Sports and Fixed Odds Horse Racing Will Be Stopped.')
		expect(contingency.state('showProceedPopup')).to.equal('block')
		expect(contingency.state('stopSellFixedODDSBackground')).to.equal(SELECTED_COLOR)
		expect(contingency.state('fixedOddFootBallBackground')).to.equal(SELECTED_COLOR)
		expect(contingency.state('fixedOddBasketBallBackground')).to.equal(SELECTED_COLOR)
		expect(contingency.state('fixedOddHorseRacingBackground')).to.equal(SELECTED_COLOR)
	})

	it('fixedOddFootBallClickHandler()', () => {
		const contingency = shallow(<ContingencyControl />)
		const SELECTED_COLOR = '#E25854'
		contingency.instance().fixedOddFootBallClickHandler()
		expect(contingency.state('paragraphOne')).to.equal('STOP SELL ALL FIXED ODDS')
		expect(contingency.state('paragraphTwo')).to.equal('All Fixed Odds Football bet types Will Be Stopped.')
		expect(contingency.state('showProceedPopup')).to.equal('block')
		expect(contingency.state('fixedOddFootBallBackground')).to.equal(SELECTED_COLOR)
	})

	it('fixedOddBasketBallClickHandler()', () => {
		const contingency = shallow(<ContingencyControl />)
		const SELECTED_COLOR = '#E25854'
		contingency.instance().fixedOddBasketBallClickHandler()
		expect(contingency.state('paragraphOne')).to.equal('STOP SELL ALL FIXED ODDS')
		expect(contingency.state('paragraphTwo')).to.equal('All Fixed Odds Basketball bet types Will Be Stopped.')
		expect(contingency.state('showProceedPopup')).to.equal('block')
		expect(contingency.state('fixedOddBasketBallBackground')).to.equal(SELECTED_COLOR)
	})

	it('fixedOddHorseClickHandler()', () => {
		const contingency = shallow(<ContingencyControl />)
		const SELECTED_COLOR = '#E25854'
		contingency.instance().fixedOddHorseClickHandler()
		expect(contingency.state('paragraphOne')).to.equal('STOP SELL ALL FIXED ODDS')
		expect(contingency.state('paragraphTwo')).to.equal('All Fixed Odds Horse Racing Bet types Will Be Stopped.')
		expect(contingency.state('showProceedPopup')).to.equal('block')
		expect(contingency.state('fixedOddHorseRacingBackground')).to.equal(SELECTED_COLOR)
	})

	it('pariMutuelClickHandler()', () => {
		const contingency = shallow(<ContingencyControl />)
		const SELECTED_COLOR = '#E25854'
		contingency.instance().pariMutuelClickHandler()
		expect(contingency.state('paragraphOne')).to.equal('STOP SELL ALL Pari-Mutuel')
		expect(contingency.state('paragraphTwo')).to.equal('All Pari-Mutuel Football bet types Will Be Stopped.')
		expect(contingency.state('showProceedPopup')).to.equal('block')
		expect(contingency.state('stopSelPariMutuelBackground')).to.equal(SELECTED_COLOR)
	})
})

describe('Click on confirm button', () => {
	it('confirmClickHandler()', () => {
		const contingency = shallow(<ContingencyControl />)
		contingency.instance().confirmClickHandler()
		const SELECTED_COLOR = '#E25854'
		const DISABLED_COLOR = '#DCDCDC'
		if (contingency.state('stopSellAllBackground') === SELECTED_COLOR) {
			expect(contingency.state('stopSellAllBackground')).to.equal(DISABLED_COLOR)
			expect(contingency.state('stopSellFixedODDSBackground')).to.equal(DISABLED_COLOR)
			expect(contingency.state('fixedOddFootBallBackground')).to.equal(DISABLED_COLOR)
			expect(contingency.state('fixedOddBasketBallBackground')).to.equal(DISABLED_COLOR)
			expect(contingency.state('fixedOddHorseRacingBackground')).to.equal(DISABLED_COLOR)
			expect(contingency.state('stopSelPariMutuelBackground')).to.equal(DISABLED_COLOR)
			expect(contingency.state('showProceedPopup')).to.equal('none')
			expect(contingency.state('popupShown')).to.equal('none')
		}
	})
})
