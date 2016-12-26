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
						text: 'External Odds Feed Configurations'
					},
					{
						text: 'In-Play Feed Configurations'
					},
					{
						text: 'Data Feed Configurations'
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
				text: 'Risk Parameters',
				subMenu: [
					{
						text: 'Exposure Monitoring Configurations',
						subMenu: [
							{
								text: 'MNL'
							},
							{
								text: 'All Up Exposure'
							},
							{
								text: 'Min. Value Per Bet Line'
							},
							{
								text: 'Event Exposure(Match)'
							},
							{
								text: 'Exposure(Tournament)'
							}
						]
					},
					{
						text: 'In-Play Bet Delay Configurations',
						subMenu: [
							{
								text: 'Event Lv 1'
							},
							{
								text: 'Bet Type'
							},
							{
								text: 'Customer Category'
							},
							{
								text: 'Channel / Devices'
							}
						]
					},
					{
						text: 'Bet Validation Configurations',
						subMenu: [
							{
								text: 'Bet Cancellation'
							},
							{
								text: 'Bet Acceptance / Intercept'
							},
							{
								text: 'Bet Ticket Display'
							},
							{
								text: 'Customer Analytics Parameters and Value Score'
							}
						]
					},
					{
						text: 'Large Bet / Investment Monitoring Configurations',
						subMenu: [
							{
								text: 'One-sided-book Live Feed'
							},
							{
								text: 'Large Bet Log Update & General Alert'
							},
							{
								text: 'Large Bet Log Alert Per Customer Category'
							},
							{
								text: 'Individual Setting'
							}
						]
					},
					{
						text: 'Odds Target Margin Configurations',
						subMenu: [
							{
								text: 'Master Setting'
							},
							{
								text: 'Individual Setting'
							}
						]
					}
				]
			},
			{
				text: 'SDA Governance',
				subMenu: [
					{
						text: 'Customer Category Maintenance'
					},
					{
						text: 'Exposure Limit',
						subMenu: [
							{
								text: 'MNL'
							},
							{
								text: 'Approval Threshold Alert'
							},
							{
								text: 'Match'
							},
							{
								text: 'Tournament'
							},
							{
								text: 'All-Up'
							}
						]
					},
					{
						text: 'Betting Event Validation',
						subMenu: [
							{
								text: 'Event Lv 1(Tournament)'
							},
							{
								text: 'Team'
							},
							{
								text: 'Venue'
							},
							{
								text: 'Odds Margin'
							}
						]
					}
				]
			},
			{
				text: 'System Control',
				subMenu: [
					{
						text: 'Bet Control Configurations',
						subMenu: [
							{
								text: 'Unit Bet & Minimum Dividend'
							},
							{
								text: 'Min. Value For Ticket/Bet Line Total'
							},
							{
								text: 'Min. Value Per Bet Line'
							},
							{
								text: 'Event Information Monitoring Config'
							},
							{
								text: 'In-Play Trading Monitoring Config'
							}
						]
					},
					{
						text: 'Message Configurations',
						subMenu: [
							{
								text: 'Message Category & Assignment'
							},
							{
								text: 'Distribution List'
							}
						]
					},
					{
						text: 'Misc',
						subMenu: [
							{
								text: 'Miscellaneous'
							},
							{
								text: 'Pick List Maintenance'
							},
							{
								text: 'Odds Relating Config'
							},
							{
								text: 'Trading Analytic Config'
							},
							{
								text: 'Result & Payout Config'
							},
							{
								text: 'Start / Stop Sell Control Monitoring Config'
							},
							{
								text: 'Task & Approval Workflow Config'
							},
							{
								text: 'User Account, Role & Privilege Configurations'
							}
						]
					},
					{
						text: 'Information Retenation Configuration',
						subMenu: [
							{
								text: 'Event Information'
							},
							{
								text: 'Live Feed'
							},
							{
								text: 'Result'
							},
							{
								text: 'Market Odds'
							}
						]
					}
				]
			},
			{
				text: 'Others'
			}

		]

	},
	{
		iconSrc: 'Icon - Compile Monitoring.svg',
		iconSrc_A: 'Icon - Compile MonitoringW.svg',
		textL1: 'Odds',
		textL2: 'Complitation'

	},
	{
		iconSrc: 'Icon - Pre-Event Monitoring.svg',
		iconSrc_A: 'Icon - Pre-Event MonitoringW.svg',
		textL1: 'Pre-Event',
		textL2: 'Monitoring'
	},
	{
		iconSrc: 'Icon - In-Play Monitoring.svg',
		iconSrc_A: 'Icon - In-Play MonitoringW.svg',
		textL1: 'In-Play',
		textL2: 'Monitoring'

	},
	{
		iconSrc: 'Icon - Result & Settlement.svg',
		iconSrc_A: 'Icon - Result & SettlementW.svg',
		textL1: 'Result &',
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
				text: 'Unmap Data Monitor',
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
				text: 'Post-Event Reports'
			},
			{
				text: 'Advance Analysis'
			}
		]

	},
	{
		iconSrc: 'Icon - Tools & Administration.svg',
		iconSrc_A: 'Icon - Tools & AdministrationW.svg',
		textL1: 'Global Tools &',
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
						text: 'Noticeboard Monitor',
						link: '/page/noticeboard'
					},
					{
						text: 'Broadcast Message',
						link: '/page/broadcast'
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
						link: '/page/actionmonitor',
						text: 'Action Monitor'
					}
				]
			},
			{
				text: 'Contingency Control',
				subMenu: [
					{
						text: 'Contingency Stop Sell',
						link: '/page/contigency'
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
						text: 'User Account Profile',
						link: '/page/userlist'
					},
					{
						text: 'User Role & Permission'
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
						text: 'External Odds Feed Configurations'
					},
					{
						text: 'In-Play Feed Configurations'
					},
					{
						text: 'Data Feed Configurations'
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
				text: 'Risk Parameters',
				subMenu: [
					{
						text: 'Exposure Monitoring Configurations',
						subMenu: [
							{
								text: 'MNL'
							},
							{
								text: 'All Up Exposure'
							},
							{
								text: 'Min. Value Per Bet Line'
							},
							{
								text: 'Event Exposure(Match)'
							},
							{
								text: 'Exposure(Tournament)'
							}
						]
					},
					{
						text: 'In-Play Bet Delay Configurations',
						subMenu: [
							{
								text: 'Event Lv 1'
							},
							{
								text: 'Bet Type'
							},
							{
								text: 'Customer Category'
							},
							{
								text: 'Channel / Devices'
							}
						]
					},
					{
						text: 'Bet Validation Configurations',
						subMenu: [
							{
								text: 'Bet Cancellation'
							},
							{
								text: 'Bet Acceptance / Intercept'
							},
							{
								text: 'Bet Ticket Display'
							},
							{
								text: 'Customer Analytics Parameters and Value Score'
							}
						]
					},
					{
						text: 'Large Bet / Investment Monitoring Configurations',
						subMenu: [
							{
								text: 'One-sided-book Live Feed'
							},
							{
								text: 'Large Bet Log Update & General Alert'
							},
							{
								text: 'Large Bet Log Alert Per Customer Category'
							},
							{
								text: 'Individual Setting'
							}
						]
					},
					{
						text: 'Odds Target Margin Configurations',
						subMenu: [
							{
								text: 'Master Setting'
							},
							{
								text: 'Individual Setting'
							}
						]
					}
				]
			},
			{
				text: 'SDA Governance',
				subMenu: [
					{
						text: 'Customer Category Maintenance'
					},
					{
						text: 'Exposure Limit',
						subMenu: [
							{
								text: 'MNL'
							},
							{
								text: 'Approval Threshold Alert'
							},
							{
								text: 'Match'
							},
							{
								text: 'Tournament'
							},
							{
								text: 'All-Up'
							}
						]
					},
					{
						text: 'Betting Event Validation',
						subMenu: [
							{
								text: 'Event Lv 1(Tournament)'
							},
							{
								text: 'Team'
							},
							{
								text: 'Venue'
							},
							{
								text: 'Odds Margin'
							}
						]
					}
				]
			},
			{
				text: 'System Control',
				subMenu: [
					{
						text: 'Bet Control Configurations',
						subMenu: [
							{
								text: 'Unit Bet & Minimum Dividend'
							},
							{
								text: 'Min. Value For Ticket/Bet Line Total'
							},
							{
								text: 'Min. Value Per Bet Line'
							},
							{
								text: 'Event Information Monitoring Config'
							},
							{
								text: 'In-Play Trading Monitoring Config'
							}
						]
					},
					{
						text: 'Message Configurations',
						subMenu: [
							{
								text: 'Message Category & Assignment'
							},
							{
								text: 'Distribution List'
							}
						]
					},
					{
						text: 'Misc',
						subMenu: [
							{
								text: 'Miscellaneous'
							},
							{
								text: 'Pick List Maintenance'
							},
							{
								text: 'Odds Relating Config'
							},
							{
								text: 'Trading Analytic Config'
							},
							{
								text: 'Result & Payout Config'
							},
							{
								text: 'Start / Stop Sell Control Monitoring Config'
							},
							{
								text: 'Task & Approval Workflow Config'
							},
							{
								text: 'User Account, Role & Privilege Configurations'
							}
						]
					},
					{
						text: 'Information Retenation Configuration',
						subMenu: [
							{
								text: 'Event Information'
							},
							{
								text: 'Live Feed'
							},
							{
								text: 'Result'
							},
							{
								text: 'Market Odds'
							}
						]
					}
				]
			},
			{
				text: 'Others'
			}

		]

	},
	{
		iconSrc: 'Icon - Pre-Event Monitoring.svg',
		iconSrc_A: 'Icon - Pre-Event MonitoringW.svg',
		textL1: 'Pre-Event',
		textL2: 'Monitoring'
	},
	{
		iconSrc: 'Icon - Result & Settlement.svg',
		iconSrc_A: 'Icon - Result & SettlementW.svg',
		textL1: 'Result &',
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
				text: 'Unmap Data Monitor',
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
		textL1: 'Global Tools &',
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
						text: 'Noticeboard Monitor',
						link: '/page/noticeboard'
					},
					{
						text: 'Broadcast Message',
						link: '/page/broadcast'
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
						link: '/page/actionmonitor',
						text: 'Action Monitor'
					}
				]
			},
			{
				text: 'Contingency Control',
				subMenu: [
					{
						text: 'Contingency Stop Sell',
						link: '/page/contigency'
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
						text: 'User Account Profile',
						link: '/page/userlist'
					},
					{
						text: 'User Role & Permission'
					}
				]
			}
		]

	}
]

export default { menuList1, menuList2 }
