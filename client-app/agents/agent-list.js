import React from 'react'
import Agent from './agent'

export default class AgentList extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            agents: [
                {
                    hostServer: 'bjstdmngbgr02.thoughtworks.com',
                    buildingStatus: 'idle',
                    ip: '192.168.1.2',
                    path: '/var/lib/cruise-agent',
                    resources: [
                        'ubuntu',
                        'firefox3',
                        'core-duo'
                    ]
                },
                {
                    hostServer: 'bjstdmngbgr02.thoughtworks.com',
                    buildingStatus: 'building',
                    ip: '192.168.1.3',
                    path: '/var/lib/cruise-agent',
                    resources: [

                    ]
                }
            ]
        }

    }

    render () {
        return <div>
            {
                this.state.agents.map((item, index) => {
                    return <Agent key={index}
                                  hostServer={item.hostServer}
                                  buildingStatus={item.buildingStatus}
                                  ip={item.ip}
                                  path={item.path}
                                  resources={item.resources}
                    />
                })
            }
        </div>
    }
}

