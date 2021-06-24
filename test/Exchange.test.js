const _TokenA = artifacts.require('TokenA');
const _TokenB = artifacts.require('TokenB');
const _Exchange = artifacts.require('Exchange');
const BigNumber = require('bignumber.js');

contract('Exchange', accounts => {
  let tokenAContract;
  let tokenBContract;
  let exchangeContract;
  const ownerAccount = accounts[0];
  const userAccount = accounts[1];
  const decimals = 18;
  const initSypply = new BigNumber(21).times(new BigNumber(10).pow(decimals));
  const price = new BigNumber(17.3182).times(new BigNumber(10).pow(decimals));

  beforeEach(async () => {
    tokenAContract = await _TokenA.new()
    tokenBContract = await _TokenB.new()
    exchangeContract = await _Exchange.new(tokenAContract.address, tokenAContract.address, price)
  });

  describe('Exchange tokens', () => {

    it('Deploys the contract Token A', async () => {
      assert.ok(tokenAContract.address);
    })

    it('Deploys the contract Token B', async () => {
      assert.ok(tokenBContract.address);
    })

    it('Owner can change price', async () => {
      let newPrice = new BigNumber(4.2576).times(new BigNumber(10).pow(decimals));
      let priceUpdate = await exchangeContract.updatePrice(newPrice, {from: ownerAccount})
      assert.ok(priceUpdate);

      let priceUpdated = new BigNumber(await exchangeContract.price.call());
      assert.strictEqual(priceUpdated.toNumber(), newPrice.toNumber());
    })

  })
})