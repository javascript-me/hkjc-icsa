import render from './client-app'

describe('entry point', () => {
	it('gives render function', (done) => {
		expect(render).to.be.a.function
		try {
			render()
		} catch (e) {
			done()
		}
	})

	describe('-configOverride()', () => {
		it('calls config.override', () => {
			const override = sinon.spy()
			rewire(render.__set__('config', {override}))

			const configOverride = render.__get__('configOverride')
			configOverride()

			rewire()
			expect(override.calledOnce).to.be.true
		})
	})

	describe('-hasAuth()', () => {
		it('does nothing if hasProfile', () => {
			rewire(render.__set__('LoginService', {
				hasProfile () {
					return true
				}
			}))
			const hasAuth = render.__get__('hasAuth')

			hasAuth()

			rewire()
		})

		it('does replace if !hasProfile', () => {
			rewire(render.__set__('LoginService', {
				hasProfile () {
					return false
				}
			}))
			const hasAuth = render.__get__('hasAuth')
			const spy = sinon.spy()

			hasAuth(null, spy)

			rewire()
			expect(spy.calledOnce).to.be.true
			expect(spy.firstCall.args[0]).to.be.equal('/')
		})
	})
})
