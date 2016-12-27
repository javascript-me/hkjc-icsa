import React from 'react'
import ContigencyButton from './contigency-button'
import ContigencyPopup from '../contigency-popup'
import Popup from '../popup'
import Moment from 'moment'

const ENABLED_COLOR = '#305091'
const SELECTED_COLOR = '#E25854'
const DISABLED_COLOR = '#DCDCDC'

export default React.createClass({
	getInitialState () {
		return {
			pageTitle: 'Home \\ Global Tools & Adminstration ',
			stopSellAllBackground: ENABLED_COLOR,
			stopSellFixedODDSBackground: ENABLED_COLOR,
			fixedOddFootBallBackground: ENABLED_COLOR,
			fixedOddBasketBallBackground: ENABLED_COLOR,
			fixedOddHorseRacingBackground: ENABLED_COLOR,
			stopSelPariMutuelBackground: ENABLED_COLOR,
			popupShown: 'none',
			showProceedPopup: 'none',
			showTimeStopAll: 'none',
			showTimeFixedOddsStopAll: 'none',
			showTimeFootBall: 'none',
			showTimeBasketBall: 'none',
			showTimeHorseRacing: 'none',
			showTimePariMutuel: 'none',
			paragraphOne: '',
			paragraphTwo: '',
			stopAllTime: '',
			stopAllFixedTime: '',
			stopFixedFootBallTime: '',
			stopFixedBasketBallTime: '',
			stopFixedHorseRacingTime: '',
			stopPariMutuelTime: ''

		}
	},
	stopSellAllClickHandler: function () {
		if (this.state.stopSellAllBackground !== DISABLED_COLOR) {
			this.clearAllStyles()
			this.setState({paragraphOne: 'STOP SELL ALL', paragraphTwo: 'All Fixed Odds Sports, Pari-Mutuel Sports and Fixed Odds Horse Racing Will Be Stopped.', showProceedPopup: 'block'})
			this.changeBGStopSellAll(SELECTED_COLOR)
			this.changeBGAllFixedOdds(SELECTED_COLOR)
			this.changeBGFixedFootBall(SELECTED_COLOR)
			this.changeBGFixedBasketBall(SELECTED_COLOR)
			this.changeBGFixedHorseRacing(SELECTED_COLOR)
			this.changeBGPariMutuel(SELECTED_COLOR)
		}
	},

	stopSellAllFixedOddsClickHandler: function () {
		if (this.state.stopSellFixedODDSBackground !== DISABLED_COLOR) {
			this.clearAllStyles()
			this.setState({paragraphOne: 'STOP SELL ALL FIXED ODDS', paragraphTwo: 'All Fixed Odds Sports and Fixed Odds Horse Racing Will Be Stopped.', showProceedPopup: 'block'})
			this.changeBGAllFixedOdds(SELECTED_COLOR)
			this.changeBGFixedFootBall(SELECTED_COLOR)
			this.changeBGFixedBasketBall(SELECTED_COLOR)
			this.changeBGFixedHorseRacing(SELECTED_COLOR)
		}
	},

	fixedOddFootBallClickHandler: function () {
		if (this.state.fixedOddFootBallBackground !== DISABLED_COLOR) {
			this.clearAllStyles()
			this.setState({paragraphOne: 'STOP SELL ALL FIXED ODDS', paragraphTwo: 'All Fixed Odds Football bet types Will Be Stopped.',	showProceedPopup: 'block'})
			this.changeBGFixedFootBall(SELECTED_COLOR)
		}
	},

	fixedOddBasketBallClickHandler: function () {
		if (this.state.fixedOddBasketBallBackground !== DISABLED_COLOR) {
			this.clearAllStyles()
			this.setState({paragraphOne: 'STOP SELL ALL FIXED ODDS', paragraphTwo: 'All Fixed Odds Basketball bet types Will Be Stopped.', showProceedPopup: 'block'})
			this.changeBGFixedBasketBall(SELECTED_COLOR)
		}
	},

	fixedOddHorseClickHandler: function () {
		if (this.state.fixedOddHorseRacingBackground !== DISABLED_COLOR) {
			this.clearAllStyles()
			this.setState({paragraphOne: 'STOP SELL ALL FIXED ODDS', paragraphTwo: 'All Fixed Odds Horse Racing Bet types Will Be Stopped.', showProceedPopup: 'block'})
			this.changeBGFixedHorseRacing(SELECTED_COLOR)
		}
	},

	pariMutuelClickHandler: function () {
		if (this.state.stopSelPariMutuelBackground !== DISABLED_COLOR) {
			this.clearAllStyles()
			this.setState({paragraphOne: 'STOP SELL ALL Pari-Mutuel', paragraphTwo: 'All Pari-Mutuel Football bet types Will Be Stopped.', showProceedPopup: 'block'})
			this.changeBGPariMutuel(SELECTED_COLOR)
		}
	},

	openPopup: function () {
		this.setState({popupShown: 'block'})
		this.refs.contigencyPopup.show()
	},

	closePopUp: function () {
		this.setState({popupShown: 'none'})
	},

	confirmClickHandler: function () {
		if (this.state.stopSellAllBackground === SELECTED_COLOR) {
			this.changeBGStopSellAll(DISABLED_COLOR)
			this.changeBGAllFixedOdds(DISABLED_COLOR)
			this.changeBGFixedFootBall(DISABLED_COLOR)
			this.changeBGFixedBasketBall(DISABLED_COLOR)
			this.changeBGFixedHorseRacing(DISABLED_COLOR)
			this.changeBGPariMutuel(DISABLED_COLOR)
			this.setState({showTimeStopAll: 'block', stopAllTime: Moment(new Date()).format('DD MMM YYYY HH:mm:ss')})
		} else if (this.state.stopSellFixedODDSBackground === SELECTED_COLOR) {
			this.changeBGAllFixedOdds(DISABLED_COLOR)
			this.changeBGFixedFootBall(DISABLED_COLOR)
			this.changeBGFixedBasketBall(DISABLED_COLOR)
			this.changeBGFixedHorseRacing(DISABLED_COLOR)
			this.setState({showTimeFixedOddsStopAll: 'block', stopAllFixedTime: Moment(new Date()).format('DD MMM YYYY HH:mm:ss')})
		} else if (this.state.fixedOddFootBallBackground === SELECTED_COLOR) {
			this.changeBGFixedFootBall(DISABLED_COLOR)
			this.setState({showTimeFootBall: 'block', stopFixedFootBallTime: Moment(new Date()).format('DD MMM YYYY HH:mm:ss')})
		} else if (this.state.fixedOddBasketBallBackground === SELECTED_COLOR) {
			this.changeBGFixedBasketBall(DISABLED_COLOR)
			this.setState({showTimeBasketBall: 'block', stopFixedBasketBallTime: Moment(new Date()).format('DD MMM YYYY HH:mm:ss')})
		} else if (this.state.fixedOddHorseRacingBackground === SELECTED_COLOR) {
			this.changeBGFixedHorseRacing(DISABLED_COLOR)
			this.setState({showTimeHorseRacing: 'block', stopFixedHorseRacingTime: Moment(new Date()).format('DD MMM YYYY HH:mm:ss')})
		} else if (this.state.stopSelPariMutuelBackground === SELECTED_COLOR) {
			this.changeBGPariMutuel(DISABLED_COLOR)
			this.setState({showTimePariMutuel: 'block', stopPariMutuelTime: Moment(new Date()).format('DD MMM YYYY HH:mm:ss')})
		}
		this.setState({
			showProceedPopup: 'none',
			popupShown: 'none'
		})
		if (((this.state.fixedOddFootBallBackground === DISABLED_COLOR || this.state.fixedOddFootBallBackground === SELECTED_COLOR) && (this.state.fixedOddBasketBallBackground === DISABLED_COLOR || this.state.fixedOddBasketBallBackground === SELECTED_COLOR) && (this.state.fixedOddHorseRacingBackground === DISABLED_COLOR || this.state.fixedOddHorseRacingBackground === SELECTED_COLOR))) {
			this.changeBGAllFixedOdds(DISABLED_COLOR)
			this.setState({showTimeFixedOddsStopAll: 'block', stopAllFixedTime: Moment(new Date()).format('DD MMM YYYY HH:mm:ss'), showTimeFootBall: 'none', showTimeBasketBall: 'none', showTimeHorseRacing: 'none'})
		}
		if (((this.state.stopSelPariMutuelBackground === DISABLED_COLOR || this.state.stopSelPariMutuelBackground === SELECTED_COLOR) && (this.state.stopSellFixedODDSBackground === DISABLED_COLOR || this.state.stopSellFixedODDSBackground === SELECTED_COLOR || this.state.stopSellFixedODDSBackground === ENABLED_COLOR) && (this.state.fixedOddFootBallBackground === DISABLED_COLOR || this.state.fixedOddFootBallBackground === SELECTED_COLOR) && (this.state.fixedOddBasketBallBackground === DISABLED_COLOR || this.state.fixedOddBasketBallBackground === SELECTED_COLOR) && (this.state.fixedOddHorseRacingBackground === DISABLED_COLOR || this.state.fixedOddHorseRacingBackground === SELECTED_COLOR))) {
			this.changeBGStopSellAll(DISABLED_COLOR)
			this.setState({showTimeStopAll: 'block', stopAllTime: Moment(new Date()).format('DD MMM YYYY HH:mm:ss'), showTimeFixedOddsStopAll: 'none', showTimeFootBall: 'none', showTimeBasketBall: 'none', showTimeHorseRacing: 'none', showTimePariMutuel: 'none'})
		}
	},

	closeProceedPopup: function () {
		this.clearAllStyles()
	},

	clearAllStyles: function () {
		if (this.state.stopSellAllBackground === SELECTED_COLOR) {
			this.changeBGStopSellAll(ENABLED_COLOR)
		}
		if (this.state.stopSellFixedODDSBackground === SELECTED_COLOR) {
			this.changeBGAllFixedOdds(ENABLED_COLOR)
		}
		if (this.state.stopSelPariMutuelBackground === SELECTED_COLOR) {
			this.changeBGPariMutuel(ENABLED_COLOR)
		}
		if (this.state.fixedOddFootBallBackground === SELECTED_COLOR) {
			this.changeBGFixedFootBall(ENABLED_COLOR)
		}
		if (this.state.fixedOddBasketBallBackground === SELECTED_COLOR) {
			this.changeBGFixedBasketBall(ENABLED_COLOR)
		}
		if (this.state.fixedOddHorseRacingBackground === SELECTED_COLOR) {
			this.changeBGFixedHorseRacing(ENABLED_COLOR)
		}
		this.setState({showProceedPopup: 'none'})
	},
	changeBGStopSellAll: function (bg) {
		if (this.state.stopSellAllBackground !== DISABLED_COLOR) {
			this.setState({stopSellAllBackground: bg})
		}
	},
	changeBGAllFixedOdds: function (bg) {
		if (this.state.stopSellFixedODDSBackground !== DISABLED_COLOR) {
			this.setState({stopSellFixedODDSBackground: bg})
		}
	},
	changeBGFixedFootBall: function (bg) {
		if (this.state.fixedOddFootBallBackground !== DISABLED_COLOR) {
			this.setState({fixedOddFootBallBackground: bg})
		}
	},
	changeBGFixedBasketBall: function (bg) {
		if (this.state.fixedOddBasketBallBackground !== DISABLED_COLOR) {
			this.setState({fixedOddBasketBallBackground: bg})
		}
	},
	changeBGFixedHorseRacing: function (bg) {
		if (this.state.fixedOddHorseRacingBackground !== DISABLED_COLOR) {
			this.setState({fixedOddHorseRacingBackground: bg})
		}
	},
	changeBGPariMutuel: function (bg) {
		if (this.state.stopSelPariMutuelBackground !== DISABLED_COLOR) {
			this.setState({stopSelPariMutuelBackground: bg})
		}
	},
	render () {
		return (
			<div className='contigency-control-container' id='contigency-container'>
				<div className='row page-header'>
					<p className='hkjc-breadcrumb'>{this.state.pageTitle}</p>
					<h1>Contingency Control</h1>
				</div>
				{/* STOP SELL ALL */}
				<div className='main-button'>
					<div className='col-md-12'>
						<div onClick={this.stopSellAllClickHandler}>
							<ContigencyButton background={this.state.stopSellAllBackground} width='278px' height='120px'
								topText='STOP SELL'
								middleText='' bottomText='ALL' topLabelStyle='28px' bottomLabelStyle='40px'
								topLabelLineHeight='30px' bottomLabelLineHeight='47px' opacity='1.0' />
						</div>
					</div>
					<div className='col-md-12'>
						<span className='sub-title'>
							All Fixed Odds Sports, Pari-Mutuel Sports and Fixed Odds Horse Racing
						</span>
						<span className='stopped-at' style={{'display': this.state.showTimeStopAll}}>Stopped at {this.state.stopAllTime}</span>
					</div>
				</div>
				{/* STOP SELL ALL FIXED ODDS */}
				<div className='col-md-12 container-stop-buttons'>
					<div className='col-md-3 container-stop-sell-all-sports'>
						<div onClick={this.stopSellAllFixedOddsClickHandler}>
							<ContigencyButton background={this.state.stopSellFixedODDSBackground} width='234px' height='109px'
								topText='STOP SELL'
								middleText='ALL FIXED ODDS' bottomText='' topLabelStyle='20px'
								bottomLabelStyle='23px'
								topLabelLineHeight='30px' bottomLabelLineHeight='27px' />
						</div>
						<span className='sub-title'>
							All Fixed Odds Sports and Fixed Odds Horse Racing
						</span>
						<span className='stopped-at' style={{'display': this.state.showTimeFixedOddsStopAll}}>Stopped at {this.state.stopAllFixedTime}</span>
					</div>

					<div className='col-md-3 container-stop-sell-football'>
						<span className='container-icon'><img src='icon/football.svg' /></span>
						<div onClick={this.fixedOddFootBallClickHandler}>
							<ContigencyButton background={this.state.fixedOddFootBallBackground} width='215px' height='97px'
								topText='STOP SELL'
								middleText='ALL FIXED ODDS' bottomText='FOOTBALL' topLabelStyle='20px'
								bottomLabelStyle='14px' topLabelLineHeight='24px'
								bottomLabelLineHeight='' />
						</div>
						<span className='sub-title'>
							All Fixed Odds Football bet types
						</span>
						<span className='stopped-at' style={{'display': this.state.showTimeFootBall}}>Stopped at {this.state.stopFixedFootBallTime}</span>
						<div onClick={this.pariMutuelClickHandler}>
							<ContigencyButton background={this.state.stopSelPariMutuelBackground} width='215px' height='97px'
								topText='STOP SELL'
								middleText='ALL Pari-Mutuel' bottomText='FOOTBALL' topLabelStyle='20px'
								bottomLabelStyle='14px' topLabelLineHeight='24px'
								bottomLabelLineHeight='' />
						</div>
						<span className='sub-title'>
						All Pari-Mutuel Football bet types
						</span>
						<span className='stopped-at' style={{'display': this.state.showTimePariMutuel}}>Stopped at {this.state.stopPariMutuelTime}</span>
					</div>

					<div className='col-md-3 container-stop-sell-basketball'>
						<span className='container-icon'><img src='icon/basketball.svg' /></span>
						<div onClick={this.fixedOddBasketBallClickHandler}>
							<ContigencyButton background={this.state.fixedOddBasketBallBackground} width='215px' height='95px'
								topText='STOP SELL'
								middleText='ALL FIXED ODDS' bottomText='BASKETBALL' topLabelStyle='20px'
								bottomLabelStyle='14px' topLabelLineHeight='24px'
								bottomLabelLineHeight='' />
						</div>
						<span className='sub-title'>
							All Fixed Odds Basketball bet types
						</span>
						<span className='stopped-at' style={{'display': this.state.showTimeBasketBall}}>Stopped at {this.state.stopFixedBasketBallTime}</span>
					</div>

					<div className='col-md-3 container-stop-sell-horse-racing'>
						<span className='container-icon'><img src='icon/horseracing.svg' /></span>
						<div onClick={this.fixedOddHorseClickHandler}>
							<ContigencyButton background={this.state.fixedOddHorseRacingBackground} width='215px' height='96px'
								topText='STOP SELL'
								middleText='ALL FIXED ODDS' bottomText='HORSE RACING' topLabelStyle='20px'
								bottomLabelStyle='14px' topLabelLineHeight='24px'
								bottomLabelLineHeight='' />
						</div>
						<span className='sub-title'>
							All Fixed Odds Horse Racing Bet types
						</span>
						<span className='stopped-at' style={{'display': this.state.showTimeHorseRacing}}>Stopped at {this.state.stopFixedHorseRacingTime}</span>
					</div>
				</div>
				<Popup ref='contigencyPopup' title='Contigency' onCancel={this.closePopUp} onConfirm={this.confirmClickHandler}>
					<ContigencyPopup popupParagraph1={this.state.paragraphOne}
						popupParagraph2={this.state.paragraphTwo} />
				</Popup>
				<div className='container-proceed-popup' style={{'display': this.state.showProceedPopup}}>
					<div className='col-md-12'>
						<button className='pull-right btn btn-primary' onClick={this.openPopup}>Proceed</button>
						<button className='pull-right btn confirm' onClick={this.closeProceedPopup}>Cancel</button>
					</div>
				</div>

				<div className='contigency-mask-container blink' style={{'display': this.state.popupShown}}>
					<div className='col-md-12' />
				</div>

			</div>
		)
	}
})
