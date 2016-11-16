import React from 'react'
import ClassNames from 'classnames'
import PubSub from '../pubsub'

export default class FilterBlock extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        };

        this.removeHandler = this.removeHandler.bind(this);
    }

    removeHandler() {
    	this.props.removeEvent(this.props.filter);
    	PubSub.publish(PubSub[this.props.changeEventTopic]);
    }

    render() {
        return (
              <span className="filter-block" onClick={this.removeHandler}>
              	{this.props.filter.value}
              </span>
        )
	}
}
