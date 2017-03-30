import React from 'react'
import ResourceList from './resource-list'
import ResourceAddingPanel from './resource-adding-panel'

export default class Agent extends React.Component {

    constructor (props) {
        super(props)
        this.addResources = this.addResources.bind(this)
    }

    addResources () {
        console.log('add.... ')
    }

    render () {
        console.log(this.props.resources)

        return <div>

            <div>
                <span className='host-server'>{this.props.hostServer}</span>

                <div>
                    <span className='status-label'>{this.props.buildingStatus}</span>
                    <span className='status-label'>{this.props.ip}</span>
                    <span className='status-label'>{this.props.path}</span>
                </div>
            </div>

            <div>
                +<span className='underline' onClick={this.addResources}>Specify Resources</span>
                <span className='status-label'>Resources: </span>
                <ResourceList resources={this.props.resources} />

            </div>

            <ResourceAddingPanel />



        </div>
    }
}