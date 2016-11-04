import render from './client-app'

describe('entry point', () => {
	it('gives render function', (done) => {
		expect(render).to.be.a.function
		try{
			render()
		} catch(e) {
			expect(e.toString()).to.have.string('not a DOM element')
			done()
		}
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
