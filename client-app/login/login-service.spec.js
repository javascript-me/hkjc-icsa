import LoginService from './login-service'
import Session from '../session'
import PubSub from '../pubsub'

const user = {
	name: 'NAME',
	password: 'PASSWORD'
}

describe('LoginService', () => {
	// reset profile in the session before every test
	beforeEach(() => {
		Session.setProfile(null);
	});

	describe('#getProfile', () => {
		it('returns cloned profile', () => {
			const profile = {a: {}}
			rewire(LoginService.__set__('profile', profile))

			const result = LoginService.getProfile()

			rewire()
			expect(result).to.be.not.equal(profile)
			expect(result).to.be.deep.equal(profile)
		})
	})

	describe('#hasProfile', () => {
		it('returns boolean profile', () => {
			expect(LoginService.hasProfile()).to.be.false
			rewire(LoginService.__set__('profile', {}))
			expect(LoginService.hasProfile()).to.be.true
			rewire()
		})
	})

	describe('#doLogin', () => {
		it('returns the profile on success, saves profile to session and triggers event', async () => {
			const response = {
				randomProfile: new Date().toString()
			}
			rewire(LoginService.__set__('postLogin', () => {
				return Promise.resolve(response)
			}))
			const done = new Promise((resolve) => {
				const subscription = PubSub.subscribe(PubSub.LOGIN_CHANGE, () => {
					PubSub.unsubscribe(subscription)
					resolve()
				})
			})

			const result = await LoginService.doLogin(user.username, user.password)

			rewire()
			expect(Session.getProfile()).to.be.deep.equal(result)
			expect(result).to.be.deep.equal(response)
			return done
		})

		it('returns null on failure without event, no profile in the session', async () => {
			rewire(LoginService.__set__('postLogin', () => {
				return Promise.reject({})
			}))
			rewire(LoginService.__set__('PubSub', null))

			const result = await LoginService.doLogin(user.username, user.password)

			rewire()

			expect(Session.getProfile()).to.be.null;
			expect(result).to.be.null
		})
	})

	describe('#logout', () => {
		it('returns null profile, no profile in the session', () => {
			const profile = {a: {}}
			rewire(LoginService.__set__('profile', profile))

			LoginService.logout()
			const result = LoginService.getProfile()

			rewire()

			expect(Session.getProfile()).to.be.null
			expect(result).to.be.null
		})

		it('triggers event', (done) => {
			const subscription = PubSub.subscribe(PubSub.LOGIN_CHANGE, () => {
				PubSub.unsubscribe(subscription)
				done()
			})

			LoginService.logout()
		})
	})
	describe('#getTasks', () => {
		it('returns the json file', () => {
			const tasks = {a: {}}
			rewire(LoginService.__set__('tasks', tasks))

			const result = LoginService.getTasksNum()

			rewire()
			expect(result).to.be.not.equal(tasks)
		})
	})
	describe('#getNoticeBoardSettings', async () => {
		it('returns the json file', () => {
			const notices = {a: {}}
			rewire(LoginService.__set__('notices', notices))

			const result = LoginService.getNoticeBoardSettings()

			rewire()
			expect(result).to.be.not.equal(notices)
		})
	})
})
