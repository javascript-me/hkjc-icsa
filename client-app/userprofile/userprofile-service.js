export default {
	async getUserProfile (userId) {
		const userProfile = {
			user: {
				'id': 'id001',
				'firstName': 'Bing',
				'lastName': 'Hu',
				'displayName': 'Bing Hu',
				'userID': 'JC10001',
				'position': 'Manager',
				'staffID': '0000001',
				'phoneNumber': '1380000001',
				'emailAddress': 'bing_hu@hkjc.com',
				'homeAddress': 'Flat 8, HKJC Building, Block 1 Jockey Road, Central, Hong Kong'
			},
			account: {
				'id': '0001',
				'displayName': 'Bing Hu',
				'status': 'Active',
				'assignedUserRoles': [{
					'assignedUserRole': 'Trading User Administrator'
				}, {
					'assignedUserRole': 'Trading Supervisor'
				}],
				'activationDate': '16/09/2016',
				'deactivationDate': '16/09/2017',
				'userID': 'JC10001'
			}
		}

		return userProfile
	}
}
