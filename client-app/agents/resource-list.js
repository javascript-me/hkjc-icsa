import React from 'react'

export default class ResourceList extends React.Component {

    constructor (props) {
        super(props)
    }

    delete (item) {
        this.props.onDelete(item)
    }

    render () {
        return <div>
            <ul>
                {
                    this.props.resources.map((item, index) => {
                        return <li key={index}>
                            {item}
                            <i onClick={() => this.delete(item)}>Delete</i>
                        </li>
                    })
                }
            </ul>
        </div>
    }

}