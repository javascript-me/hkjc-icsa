import React from 'react'

export default class ResourceAddingPanel extends React.Component {

    constructor (props) {
        super(props)

        this.changeText = this.changeText.bind(this)
        this.addResources = this.addResources.bind(this)

        this.state = {
            value: ''
        }
    }

    changeText (e) {
        this.setState({
            value: e.target.value
        })
    }

    addResources () {
        this.props.onAddedResources(this.state.value)
    }

    render () {
        return <div className='resource-creator'>
            <span className="icon-triangle"></span>
            <div>(Separate multiple resources name with commas)</div>
            <input className='input-field' type='text' value={this.state.value} onChange={this.changeText}></input>
            <div>
                <div className='round-button' onClick={this.addResources}>Add resources</div>
                <div className='round-button' onClick={this.props.onClose}>Close</div>
            </div>
        </div>
    }

}