const _TokenA = artifacts.require('TokenA');
const _TokenB = artifacts.require('TokenB');
const _Exchange = artifacts.require('Exchange');

contract('Exchange', function (accounts) {
  let tokenAContract;
  let tokenBContract;
  let exchangeContract;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];
  const _decimals = 18;
  const initSypply = 21 * 10 ** _decimals;
  const price = 17318200000000000000;

  let init = async () => {
    tokenAContract = await _TokenA.new()
    tokenBContract = await _TokenB.new()
    exchangeContract = await _Exchange.new(tokenAContract.address, tokenAContract.address, price)
  }

  describe('Exchange tokens', () => {
    beforeEach(init)

    it('Deploys the contract Token A', async () => {
      assert.ok(tokenAContract.address);
    })

    it('Deploys the contract Token B', async () => {
      assert.ok(tokenBContract.address);
    })

    it('Owner should be able to change price', async () => {
      const newPrice = 4258200000000000000;
      let priceUpdate = await exchangeContract.updatePrice(newPrice, {from: ownerAccount})
      assert.ok(priceUpdate);

      let priceUpdated = await exchangeContract.price.call();
      assert.strictEqual(priceUpdated.toNumber(), newPrice);
    })

  })
})