const _TokenA = artifacts.require('TokenA')
const _TokenB = artifacts.require('TokenB')
const _Exchange = artifacts.require('Exchange')

contract('Exchange', function (accounts) {
  let tokenAContract
  let tokenBContract
  let exchangeContract
  const ownerAccount = accounts[0]
  const userAccount = accounts[1]
  const decimals = 18
  const TOTAL_SUPPLY = 21 * 10 ** decimals
  const price = 17318200000000000000
  let initialUserEther

  let init = async () => {
    tokenAContract = await _TokenA.new()
    tokenBContract = await _TokenB.new()
    exchangeContract = await _Exchange.new(tokenAContract.address, tokenAContract.address, price)
  }

  describe('Price update', () => {
    beforeEach(init)

    it('Owner should be able to change price', async () => {
      let res = await exchangeContract.updatePrice(4258200000000000000, {from: ownerAccount})
      assert.ok(res)

      let rate = await exchangeContract.rate.call()
      expect(rate.toNumber()).to.equal(4258200000000000000)
    })

    it('Only Owner should be able to change price', async () => {
      try {
        await exchangeContract.updateRate(2000, {from: userAccount})
      } catch (e) {
        assert.ok(e)
      }

      let rate = await exchangeContract.rate.call()
      expect(rate.toNumber()).to.equal(1000)
    })
  })
})