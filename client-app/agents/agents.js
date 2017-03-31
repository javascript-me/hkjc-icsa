import React from 'react'
import AgentList from './agent-list'

export default class Agents extends React.Component {

    constructor (props) {
        super(props)
    }

    render () {
        return <div className='agent-container'>
            <AgentList />
        </div>
    }
}

