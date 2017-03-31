import React from 'react'
import ResourceList from './resource-list'
import ResourceAddingPanel from './resource-adding-panel'
import ClassNames from 'classnames'

export default class Agent extends React.Component {

    constructor (props) {
        super(props)

        this.openResourceAddingPanel = this.openResourceAddingPanel.bind(this)
        this.closeResourceAddingPanel = this.closeResourceAddingPanel.bind(this)
        this.addResources = this.addResources.bind(this)
        this.deleteResource = this.deleteResource.bind(this)

        this.state = {
            resources: this.props.resources,
            visibleResourceAddingPanel: false
        }
    }

    openResourceAddingPanel () {
        this.setState({
            visibleResourceAddingPanel: true
        })
    }

    closeResourceAddingPanel () {
        this.setState({
            visibleResourceAddingPanel: false
        })
    }

    addResources (string) {
        let trimmedString = string.trim()

        if (!trimmedString) return

        let newResources = trimmedString.split(',')

        this.setState({
            resources: this.state.resources.concat(newResources),
            visibleResourceAddingPanel: false
        })
    }

    deleteResource (item) {
        let resources = this.state.resources
        let newResources = resources.filter((element) => {
            return element !== item
        })
        this.setState({
            resources: newResources
        })
    }

    getAgentItemClassName () {
        return ClassNames(
            'agent-item',
            this.props.buildingStatus
        )
    }

    render () {
        return <div className={this.getAgentItemClassName()}>
            <div>
                <span className='host-server'>{this.props.hostServer}</span>
                <div className='statuses'>
                    <span className='status-label'>{this.props.buildingStatus}</span>
                    <span className='status-label'>{this.props.ip}</span>
                    <span className='status-label'>{this.props.path}</span>
                </div>
            </div>

            <div>
                +<span className='underline' onClick={this.openResourceAddingPanel}>Specify Resources</span>
                <span className='status-label'>Resources: </span>
                <ResourceList resources={this.state.resources}
                              onDelete={this.deleteResource} />
            </div>
            {
                this.state.visibleResourceAddingPanel ? <ResourceAddingPanel onAddedResources={this.addResources} onClose={this.closeResourceAddingPanel} /> : null
            }
        </div>
    }
}