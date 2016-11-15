import React from 'react';
import ClassNames from 'classnames';
import PubSub from '../pubsub';

export default class BetType extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        };

        this.changeBetTypeHandler = this.changeBetTypeHandler.bind(this);
    }

    getBetTypeIconClassName(betType) {
      return ClassNames(
        'bet-type',
        'icon-' + betType,
        {
          'active': this.props.selectedBetType === betType
        });
    }

    changeBetTypeHandler() {       
		if(this.props.selectedBetType !== this.props.betType) {
			this.props.changeBetTypeEvent(this.props.betType);

            PubSub.publish(PubSub[this.props.changeEventTopic]);
		}
    }

    render() {
        return (
              <i className={this.getBetTypeIconClassName(this.props.betType)} 
              	onClick={this.changeBetTypeHandler}></i>
        );
    }
}
