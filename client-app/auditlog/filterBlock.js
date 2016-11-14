import React from 'react';
import ClassNames from 'classnames';
import PubSub from '../pubsub';

export default class FilterBlock extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    removeFilterHandler() {
    	let me = this;
    	
    	PubSub.publish(PubSub[me.props.removeEventTopic], me.props.filter);
    }

    render() {
        return (
              <span className="filter-block" onClick={this.removeFilterHandler}>
              	{this.props.filter.value}
              </span>
        );
    }
}
