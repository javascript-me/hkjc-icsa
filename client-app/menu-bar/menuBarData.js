const menuList1 = [
	{
		iconSrc: 'Icon - Dashboard.svg',
		iconSrc_A: 'Icon - DashboardW.svg',
		textL1: 'Home',
		link: '/page'
	},
	{
		iconSrc: 'Icon - Event Management White.svg',
		iconSrc_A: 'Icon - Event Management WhiteW.svg',
		textL1: 'Event',
		textL2: 'Management',
		subMenu: [
			{
				text: 'Data & Feed Configuration',
				subMenu: [
					{
						text: 'Bet Control Configurations',
						subMenu: [

							{
								text: 'Unit Bet & Minimum Dividend Min'
							},
							{
								text: 'Value For Ticket/Bet Line Total Min'
							},
							{
								text: 'Value Per Bet Line'
							},
							{
								text: 'Event Information Monitoring Config'
							},
							{
								text: 'xxx xxxx Monitoring Config'
							}
						]
					},
					{
						text: 'Message Configurations',
						subMenu: [

							{
								text: 'Unit Bet & Minimum Dividend Min'
							},
							{
								text: 'Value For Ticket/Bet Line Total Min'
							},
							{
								text: 'Value Per Bet Line'
							},
							{
								text: 'Event Information Monitoring Config'
							},
							{
								text: 'xxx xxxx Monitoring Config'
							}
						]
					},
					{
						text: 'Misc',
						subMenu: [

							{
								text: 'Unit Bet & Minimum Dividend Min'
							},
							{
								text: 'Value For Ticket/Bet Line Total Min'
							},
							{
								text: 'Value Per Bet Line'
							},
							{
								text: 'Event Information Monitoring Config'
							},
							{
								text: 'xxx xxxx Monitoring Config'
							}
						]
					},
					{
						text: 'Information Retenation Configuration'
					}
				]
			},

			{
				text: 'Product Parameters',
				subMenu: [
					{ text: 'Product Parameters' },
					{ text: 'Risk Parameters' },
					{ text: 'SDA Governance' },
					{ text: 'System Control' },
					{ text: 'Others' }
				]

			},
			{
				text: 'Risk Parameters',
				subMenu: [
					{
						text: 'Bet Control Configurations',
						subMenu: [

							{
								text: 'Unit Bet & Minimum Dividend Min'
							},
							{
								text: 'Value For Ticket/Bet Line Total Min'
							},
							{
								text: 'Value Per Bet Line'
							},
							{
								text: 'Event Information Monitoring Config'
							},
							{
								text: 'xxx xxxx Monitoring Config'
							}
						]
					},
					{
						text: 'Message Configurations',
						subMenu: [

							{
								text: 'Unit Bet & Minimum Dividend Min'
							},
							{
								text: 'Value For Ticket/Bet Line Total Min'
							},
							{
								text: 'Value Per Bet Line'
							},
							{
								text: 'Event Information Monitoring Config'
							},
							{
								text: 'xxx xxxx Monitoring Config'
							}
						]
					},
					{
						text: 'Misc',
						subMenu: [

							{
								text: 'Unit Bet & Minimum Dividend Min'
							},
							{
								text: 'Value For Ticket/Bet Line Total Min'
							},
							{
								text: 'Value Per Bet Line'
							},
							{
								text: 'Event Information Monitoring Config'
							},
							{
								text: 'xxx xxxx Monitoring Config'
							}
						]
					},
					{
						text: 'Information Retenation Configuration'
					}
				]
			},
			{ text: 'SDA Governance' },
			{ text: 'System Control' },
			{ text: 'Others' }

		]

	},
	{
		iconSrc: 'Icon - Compile Monitoring.svg',
		iconSrc_A: 'Icon - Compile MonitoringW.svg',
		textL1: 'Odds',
		textL2: 'Complitation',
		

	},
	{
		iconSrc: 'Icon - Pre-Event Monitoring.svg',
		iconSrc_A: 'Icon - Pre-Event MonitoringW.svg',
		textL1: 'Pre-Event',
		textL2: 'Monitoring',
	},
	{
		iconSrc: 'Icon - In-Play Monitoring.svg',
		iconSrc_A: 'Icon - In-Play MonitoringW.svg',
		textL1: 'In-Play',
		textL2: 'Monitoring',
		

	},
	{
		iconSrc: 'Icon - In-Play Monitoring.svg',
		iconSrc_A: 'Icon - In-Play MonitoringW.svg',
		textL1: 'Result&',
		textL2: 'Settlement'

	},
	{
		iconSrc: 'Icon - Data Management.svg',
		iconSrc_A: 'Icon - Data ManagementW.svg',
		textL1: 'Data',
		textL2: 'Management',
		subMenu: [
			{
				text: 'Data Attribute Mapping'
			},
			{
				text: 'Name Management',
				subMenu: [
					{
						text: 'Competition'
					},
					{
						text: 'Team'
					},
					{
						text: 'Player'
					},
					{
						text: 'Venue'
					}
				]
			},
			{
				text: 'Data Feed Alignment Summary',
				subMenu: [
					{
						text: 'Competition'
					},
					{
						text: 'Match'
					}
				]
			},
			{
				text: 'Data Feed Log'
			}
		]

	},
	{
		iconSrc: 'Icon - Post Analysis.svg',
		iconSrc_A: 'Icon - Post AnalysisW.svg',
		textL1: 'Post Analysis',
		textL2: '& Reporting',
		subMenu: [
			{
				text: 'Post-event Reports'
			},
			{
				text: 'Advance Analysis'
			}
		]

	},
	{
		iconSrc: 'Icon - Tools & Administration.svg',
		iconSrc_A: 'Icon - Tools & AdministrationW.svg',
		textL1: 'Global Tools&',
		textL2: 'Administration',
		subMenu: [
			{
				text: 'Navigation',
				subMenu: [
					{
						text: 'Event Directory'
					}
				]
			},
			{
				text: 'Communication',
				subMenu: [
					{
						text: 'Noticeboard'
					},
					{
						text: 'Noticeboard Monitor'
					},
					{
						text: 'Broadcast Message'
					},
					{
						text: 'Broadcast Message History'
					},
					{
						text: 'Critical Information Dissemination'
					}
				]
			},
			{
				text: 'Action(Task)',
				subMenu: [
					{
						text: 'Action'
					},
					{
						text: 'Action Monitor'
					}
				]
			},
			{
				text: 'Contingency Control',
				subMenu: [
					{
						text: 'Contingency Stop Sell'
					}
				]
			},
			{
				text: 'Audit Trail',
				link: '/page/audit'
			},
			{
				text: 'User',
				subMenu: [
					{
						text: 'User Account Profile'
					}
				]
			}
		]

	},
	{
		iconSrc: 'Icon - Global Configuration.svg',
		iconSrc_A: 'Icon - Global ConfigurationW.svg',
		textL1: 'Global',
		textL2: 'Configurations',
		subMenu: [
			{
				text: 'SDA Governance',
				subMenu: [
					{
						text: 'Customer Category Maintenance'
					},
					{
						text: 'Exposure Limits'
					},
					{
						text: 'Betting Event Validation'
					},
					{
						text: 'Odds Margin'
					}
				]
			},
			{
				text: 'Data & Feed Configuration',
				subMenu: [
					{
						text: 'Data Feed Configurations'
					},
					{
						text: 'In-Play Feed Configurations '
					},
					{
						text: 'External Odds Feed Configurations'
					}
				]
			},
			{
				text: 'System Controls Configurations',
				subMenu: [
					{
						text: 'Communication'
					},
					{
						text: 'Task & Approval Workflow'
					},
					{
						text: 'Information Retention'
					}
				]
			},
			{
				text: 'Odds Parameters'
			},
			{
				text: 'Product Parameters'	
			},
			{
				text: 'Risk Parameters'
			},
			{
				text: 'Others',
				subMenu: [
					{
						text: 'Sports Game Configurations'
					}
				]
			}
		]

	}
]

const menuList2 = [
	{
		iconSrc: 'Icon - Dashboard.svg',
		iconSrc_A: 'Icon - DashboardW.svg',
		textL1: 'Home',
		link: '/page'
	},
		{
		iconSrc: 'Icon - Event Management White.svg',
		iconSrc_A: 'Icon - Event Management WhiteW.svg',
		textL1: 'Event',
		textL2: 'Management',
		subMenu: [
			{
				text: 'Data & Feed Configuration',
				subMenu: [
					{
						text: 'Bet Control Configurations',
						subMenu: [

							{
								text: 'Unit Bet & Minimum Dividend Min'
							},
							{
								text: 'Value For Ticket/Bet Line Total Min'
							},
							{
								text: 'Value Per Bet Line'
							},
							{
								text: 'Event Information Monitoring Config'
							},
							{
								text: 'xxx xxxx Monitoring Config'
							}
						]
					},
					{
						text: 'Message Configurations',
						subMenu: [

							{
								text: 'Unit Bet & Minimum Dividend Min'
							},
							{
								text: 'Value For Ticket/Bet Line Total Min'
							},
							{
								text: 'Value Per Bet Line'
							},
							{
								text: 'Event Information Monitoring Config'
							},
							{
								text: 'xxx xxxx Monitoring Config'
							}
						]
					},
					{
						text: 'Misc',
						subMenu: [

							{
								text: 'Unit Bet & Minimum Dividend Min'
							},
							{
								text: 'Value For Ticket/Bet Line Total Min'
							},
							{
								text: 'Value Per Bet Line'
							},
							{
								text: 'Event Information Monitoring Config'
							},
							{
								text: 'xxx xxxx Monitoring Config'
							}
						]
					},
					{
						text: 'Information Retenation Configuration'
					}
				]
			},

			{
				text: 'Product Parameters',
				subMenu: [
					{ text: 'Product Parameters' },
					{ text: 'Risk Parameters' },
					{ text: 'SDA Governance' },
					{ text: 'System Control' },
					{ text: 'Others' }
				]

			},
			{
				text: 'Risk Parameters',
				subMenu: [
					{
						text: 'Bet Control Configurations',
						subMenu: [

							{
								text: 'Unit Bet & Minimum Dividend Min'
							},
							{
								text: 'Value For Ticket/Bet Line Total Min'
							},
							{
								text: 'Value Per Bet Line'
							},
							{
								text: 'Event Information Monitoring Config'
							},
							{
								text: 'xxx xxxx Monitoring Config'
							}
						]
					},
					{
						text: 'Message Configurations',
						subMenu: [

							{
								text: 'Unit Bet & Minimum Dividend Min'
							},
							{
								text: 'Value For Ticket/Bet Line Total Min'
							},
							{
								text: 'Value Per Bet Line'
							},
							{
								text: 'Event Information Monitoring Config'
							},
							{
								text: 'xxx xxxx Monitoring Config'
							}
						]
					},
					{
						text: 'Misc',
						subMenu: [

							{
								text: 'Unit Bet & Minimum Dividend Min'
							},
							{
								text: 'Value For Ticket/Bet Line Total Min'
							},
							{
								text: 'Value Per Bet Line'
							},
							{
								text: 'Event Information Monitoring Config'
							},
							{
								text: 'xxx xxxx Monitoring Config'
							}
						]
					},
					{
						text: 'Information Retenation Configuration'
					}
				]
			},
			{ text: 'SDA Governance' },
			{ text: 'System Control' },
			{ text: 'Others' }

		]

	},
	{
		iconSrc: 'Icon - Pre-Event Monitoring.svg',
		iconSrc_A: 'Icon - Pre-Event MonitoringW.svg',
		textL1: 'Pre-Event',
		textL2: 'Monitoring',
	},
	{
		iconSrc: 'Icon - In-Play Monitoring.svg',
		iconSrc_A: 'Icon - In-Play MonitoringW.svg',
		textL1: 'Result&',
		textL2: 'Settlement'

	},
	{
		iconSrc: 'Icon - Data Management.svg',
		iconSrc_A: 'Icon - Data ManagementW.svg',
		textL1: 'Data',
		textL2: 'Management',
		subMenu: [
			{
				text: 'Data Attribute Mapping'
			},
			{
				text: 'Name Management',
				subMenu: [
					{
						text: 'Competition'
					},
					{
						text: 'Team'
					},
					{
						text: 'Player'
					},
					{
						text: 'Venue'
					}
				]
			},
			{
				text: 'Data Feed Alignment Summary',
				subMenu: [
					{
						text: 'Competition'
					},
					{
						text: 'Match'
					}
				]
			},
			{
				text: 'Data Feed Log'
			}
		]

	},
	{
		iconSrc: 'Icon - Tools & Administration.svg',
		iconSrc_A: 'Icon - Tools & AdministrationW.svg',
		textL1: 'Global Tools&',
		textL2: 'Administration',
		subMenu: [
			{
				text: 'Navigation',
				subMenu: [
					{
						text: 'Event Directory'
					}
				]
			},
			{
				text: 'Communication',
				subMenu: [
					{
						text: 'Noticeboard'
					},
					{
						text: 'Noticeboard Monitor'
					},
					{
						text: 'Broadcast Message'
					},
					{
						text: 'Broadcast Message History'
					},
					{
						text: 'Critical Information Dissemination'
					}
				]
			},
			{
				text: 'Action(Task)',
				subMenu: [
					{
						text: 'Action'
					},
					{
						text: 'Action Monitor'
					}
				]
			},
			{
				text: 'Contingency Control',
				subMenu: [
					{
						text: 'Contingency Stop Sell'
					}
				]
			},
			{
				text: 'Audit Trail',
				link: '/page/audit'
			},
			{
				text: 'User',
				subMenu: [
					{
						text: 'User Account Profile'
					}
				]
			}
		]

	}
]

export default { menuList1, menuList2 }
