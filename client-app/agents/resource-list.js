import React from 'react'

export default class ResourceList extends React.Component {

    constructor (props) {
        super(props)
    }

    delete (item) {
        this.props.onDelete(item)
    }

    render () {
        return <ul className='resource-list'>
            {
                this.props.resources.map((item, index) => {
                    return <li key={index}>
                        {item}
                        <div className='delete-icon' onClick={() => this.delete(item)}>X</div>
                    </li>
                })
            }
        </ul>

    }

}