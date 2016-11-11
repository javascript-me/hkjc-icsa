import React from 'react'
import ClassNames from 'classnames';
import PubSub from '../pubsub'

export default class BetType extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    getBetTypeIconClassName(betType) {
      return ClassNames(
        'bet-type',
        'icon-' + betType,
        {
          'active': this.props.selectedBetType === betType
        });
    }

    getChangeBetTypeHandler(betType) {
    	return () => {
    		if(this.props.selectedBetType !== betType) {
    			PubSub.publish(PubSub.BET_TYPE_CHANGE, betType);
    		}    		
    	};
    }

    render() {
        return (
              <i className={this.getBetTypeIconClassName(this.props.betType)} 
              	onClick={this.getChangeBetTypeHandler(this.props.betType)}></i>
        );
    }
}
