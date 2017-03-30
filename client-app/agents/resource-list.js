import React from 'react'

export default class ResourceList extends React.Component {

    render () {
        console.log(this.props.resources)

        return <div>
            <ul>
                {
                    this.props.resources.map((item, index) => {
                        return <li key={index}>{item}</li>
                    })
                }
            </ul>
        </div>
    }

}