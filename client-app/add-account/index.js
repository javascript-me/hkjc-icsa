import React, {Component} from 'react'
import AddAccountProcess from './add-account-service.js'
import ItemFilter from './filter-cmp.js'
import ProfileStep from './profile-step.js'

const header = [
	{label: 'Display Name', field: 'displayName'},
	{label: 'User Id', field: 'userID'},
	{label: 'Position/Title', field: 'position'}
]

class AddAccount extends Component {
	constructor (props) {
		super(props)
		this.AddAccount = new AddAccountProcess()
		this.state = {
			tableData: [],
			userBasic: {},
			step: (this.props.step || 0)
		}
		this.handleAdd = this.handleAdd.bind(this)
	}

	render () {
		return (
			<div className="add-user-main-container">
				<div className="add-useraccount-cmp" style={{display: this.props.step === 1 ? 'block' : 'none'}} >
					<div className='filter-container'>
						<ItemFilter title='Add User' tableData={this.state.tableData} header={header} postiveBtn={{text: 'Cancle', callback: null}} activeBtn={{text: 'Add', callback: this.handleAdd}} />
					</div>
				</div>
				<div style={{display: this.props.step === 2 ? 'block' : 'none' }}>
					<ProfileStep userBasic={this.state.userBasic} />
				</div>
			</div>
		)
	}

	async getUsers () {
		let users = []
		users = await this.AddAccount.getAccountData()
		this.setState({tableData: users})
	}

	componentDidMount () {
		this.getUsers()
		
	}
	
	
	handleAdd (item) {
		this.setState({userBasic:item})
		this.props.handleStep(2)
}
}
AddAccount.propTypes = {
	step: React.PropTypes.number
	
}

export default AddAccount
