import config from './'

describe('config', () => {
	describe('+get', () => {
		it('returns config clone', () => {
			const configMerged = {
				random: new Date().toString()
			}
			rewire(config.__set__('config', configMerged))

			const result = config.get()

			rewire()
			expect(result).to.be.not.equal(configMerged)
			expect(result).to.be.deep.equal(configMerged)
		})

		it('returns selection clone', () => {
			const configMerged = {
				a: {
					b: {
						c: {
							random: new Date().toString()
						}
					}
				}
			}
			rewire(config.__set__('config', configMerged))

			const result = config.get('a.b.c')

			rewire()
			const expected = configMerged.a.b.c
			expect(result).to.be.not.equal(expected)
			expect(result).to.be.deep.equal(expected)
		})
	})

	describe('+is', () => {
		it('returns boolean value', () => {
			const configMerged = {
				a: {
					b: {
						c: null
					}
				}
			}
			rewire(config.__set__('config', configMerged))

			const result1 = config.is('a.b')
			const result2 = config.is('a.b.c')

			rewire()
			expect(result1).to.be.true
			expect(result2).to.be.false
		})
	})

	describe('+has, +can', () => {
		it('equals is()', () => {
			const configMerged = {
				a: true
			}
			rewire(config.__set__('config', configMerged))

			const result1 = config.has('a')
			const result2 = config.can('a')

			rewire()
			expect(result1).to.be.true
			expect(result2).to.be.true
		})
	})

	describe('-merge', () => {
		it('returns default', () => {
			const configJson = {
				default: {
					random: new Date().toString()
				},
				override: {
				}
			}
			const merge = config.__get__('merge')

			const result = merge(configJson)

			expect(result).to.be.deep.equal(configJson.default)
		})

		it('merges override', () => {
			const configJson = {
				default: {
					a: 1,
					b: {
						aa: 2
					}
				},
				override: {
					'': {
						b: {
							aa: 3
						}
					}
				}
			}
			const merge = config.__get__('merge')

			const result = merge(configJson)

			expect(result).to.be.deep.equal({
				a: 1,
				b: {
					aa: 3
				}
			})
		})

		it('merges override pattern', () => {
			const configJson = {
				default: {
					a: 1,
					b: {
						aa: 2
					}
				},
				override: {
					'127.0.0.1|local.*': {
						b: {
							aa: 3
						}
					}
				}
			}
			rewire(config.__set__('domain', 'localhost'))
			const merge = config.__get__('merge')

			const result = merge(configJson)

			rewire()
			expect(result).to.be.deep.equal({
				a: 1,
				b: {
					aa: 3
				}
			})
		})
	})

	describe('+url', () => {
		it('concatenates to config url', () => {
			const configJson = {
				url: 'http://some.example.domain'
			}
			rewire(config.__set__('config', configJson))

			const url = '/hoo/bar'
			const result = config.url(url)

			rewire()
			expect(result).to.be.string(configJson.url + url)
		})

		it('concatenates avoiding double /', () => {
			const configJson = {
				url: '../lol/'
			}
			rewire(config.__set__('config', configJson))

			const result = config.url('/hoo/bar')

			rewire()
			expect(result).to.be.string('../lol/hoo/bar')
		})
	})
})
