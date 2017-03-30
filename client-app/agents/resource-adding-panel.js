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
        return <div>
            <div>(Separate multiple resources name with commas)</div>
            <input type='text' value={this.state.value} onChange={this.changeText}></input>
            <div onClick={this.addResources}>Add resources</div>
            <div onClick={this.props.onClose}>Close</div>
        </div>
    }

}