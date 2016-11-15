import React from 'react'
import ClassNames from 'classnames'
import PubSub from '../pubsub'

export default class BetType extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
		}
	}

	getBetTypeIconClassName (betType) {
		return ClassNames(
        'bet-type',
        'icon-' + betType,
			{
				'active': this.props.selectedBetType === betType
			})
	}

	getChangeBetTypeHandler (betType) {
		let me = this

    	return () => {
    		if (me.props.selectedBetType !== betType) {
    			PubSub.publish(PubSub[me.props.changeEventTopic], betType)
    		}
    	}
	}

	render () {
		return (
              <i className={this.getBetTypeIconClassName(this.props.betType)}
	onClick={this.getChangeBetTypeHandler(this.props.betType)} />
        )
	}
}
