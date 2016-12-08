import React, {Component} from 'react'
import AddAccountProcess from './add-account-service.js'
import ItemFilter from '../search-list-pannel'
import ProfileStep from './profile-step.js'
import moment from 'moment'

const header = [
	{label: 'Display Name', field: 'displayName'},
	{label: 'User Id', field: 'userID'},
	{label: 'Position/Title', field: 'position'}
]

const initialAccountInfo = {
	id: '',
	displayName: 'default',
	status: 'Active',
	assignedUserRoles: [],
	activationDate: moment(new Date()).format('DD/MM/YYYY'),
	deactivationDate: moment(new Date()).format('DD/MM/YYYY'),
	userID: ''
}

class AddAccount extends Component {
	constructor (props) {
		super(props)
		this.AddAccount = new AddAccountProcess()
		this.state = {
			tableData: [],
			userAccount: initialAccountInfo,
			userBasic: {}

		}
		this.handleAdd = this.handleAdd.bind(this)
		this.handleCreateSuccess = this.handleCreateSuccess.bind(this)
	}

	render () {
		return (
			<div className='add-user-main-container'>
				<div className='add-useraccount-cmp' style={{display: this.state.step === 1 ? 'block' : 'none'}} >
					<div className='filter-container'>
						<ItemFilter title='Add User' tableData={this.state.tableData} header={header} postiveBtn={{text: 'Cancel', callback: () => { this.props.setStep(0) }}} activeBtn={{text: 'Add', callback: this.handleAdd}} />
					</div>
				</div>
				<div style={{display: this.state.step === 2 ? 'block' : 'none'}}>
					<ProfileStep userBasic={this.state.userBasic} userAccount={this.state.userAccount} handleCreateSuccess={this.handleCreateSuccess} setStep={this.props.setStep} />
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
	componentWillReceiveProps (nextProps) {
		this.setState({step: nextProps.step})
	}

	handleAdd (item) {
		let newAccountInfo = Object.assign({}, initialAccountInfo, {displayName: item.displayName, userID: item.userID})
		this.setState({userBasic: item, userAccount: newAccountInfo, step: 2})
	}

	handleCreateSuccess () {
		this.props.setStep(0)
	}
}

AddAccount.propTypes = {
	setStep: React.PropTypes.func
}

export default AddAccount
