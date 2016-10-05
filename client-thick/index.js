nw.Window.get()
.on('blur', () => {
	console.log('User is leaving the focus') // eslint-disable-line no-console
})
.maximize()
