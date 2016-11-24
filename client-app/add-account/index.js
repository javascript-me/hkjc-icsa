import React, {Component} from 'react'
import AddAccountProcess from './add-account-service.js'
import ItemFilter from './filter-cmp.js'

const header = [
	{label:'Display Name',field:'displayName'},
	{label:'User Id',field:'userId'},
	{label:'Position/Title',field:'position'}
	]

class AddAccount extends Component {
	constructor(props) {
		super(props)
		this.AddAccount = new AddAccountProcess()
		this.state = {
			tableData: []
		}
	}

	render () {
		return (
			<div className='add-useraccount-cmp'>
				<ItemFilter title="Add User" tableData={this.state.tableData} header={header} />
			</div>
		)
	}

	async getUsers () {
		let users = []
		users = await this.AddAccount.getAccountData()
		this.setState({tableData:users})
	}
	
	componentDidMount() {
		this.getUsers()
	}
	
}

export default AddAccount
