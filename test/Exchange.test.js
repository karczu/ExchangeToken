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
  const initSupply = new BigNumber(21).times(new BigNumber(10).pow(decimals));
  const price = new BigNumber(17.3182).times(new BigNumber(10).pow(decimals));

  beforeEach(async () => {
    tokenAContract = await _TokenA.new({from: ownerAccount})
    tokenBContract = await _TokenB.new()
    exchangeContract = await _Exchange.new(tokenAContract.address, tokenBContract.address, price)
  });

  describe('Exchange tokens', () => {

    it('Deploys the contract Token A', async () => {
      assert.ok(tokenAContract.address);
      console.log('Token A address = ', tokenAContract.address);
    })

    it('Deploys the contract Token B', async () => {
      assert.ok(tokenBContract.address);
      console.log('Token B address = ', tokenBContract.address);
    })

    it('Deploys the Exchange contract', async () => {
      assert.ok(exchangeContract.address);
      console.log('Exchange token address = ', exchangeContract.address);
    })

    it('Owner can change price', async () => {
      let newPrice = new BigNumber(4.2576).times(new BigNumber(10).pow(decimals));
      let priceUpdate = await exchangeContract.updatePrice(newPrice)
      assert.ok(priceUpdate);

      let priceUpdated = new BigNumber(await exchangeContract.price.call());
      assert.strictEqual(priceUpdated.toNumber(), newPrice.toNumber());
      
      console.log('price default = ', price.toNumber());
      console.log('price updated = ', priceUpdated.toNumber());
    })

    it('Set allowance token A', async () => {
      let amountAllA = new BigNumber(14.2576).times(new BigNumber(10).pow(decimals));
      let setAllowance = await tokenAContract.approve(exchangeContract.address, amountAllA);
      assert.ok(setAllowance);
    })

    it('Set allowance token B', async () => {
      let amountAllB = new BigNumber(12.2576).times(new BigNumber(10).pow(decimals));
      let setAllowance = await tokenBContract.approve(exchangeContract.address, amountAllB);
      assert.ok(setAllowance);
      let y = new BigNumber(await tokenBContract.allowance(ownerAccount, exchangeContract.address));
      console.log('allowance b = ', y.toNumber());
    })

    // it('Balance', async () => {
    //   console.log('Exchange = ', exchangeContract.address, 'A = ', tokenAContract.address, 'B = ', tokenBContract.address);
    //   let x = new BigNumber(await tokenAContract.balanceOf(ownerAccount));
    //   console.log('balance a = ', x.toNumber());
    //   let y = new BigNumber(await tokenAContract.allowance(ownerAccount, exchangeContract.address));
    //   console.log('allowance a = ', y.toNumber());
    //   let p = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
    //   console.log('balance b = ', p.toNumber());
    //   let r = new BigNumber(await tokenBContract.allowance(ownerAccount, exchangeContract.address));
    //   console.log('allowance b = ', r.toNumber());
    //   assert.ok(true);
    // })

    it('Deposit token B', async () => {
      let amountAllowance = new BigNumber(15).times(new BigNumber(10).pow(decimals));
      let setAllowance = await tokenBContract.approve(exchangeContract.address, amountAllowance);
      
      let amountDeposit = new BigNumber(12).times(new BigNumber(10).pow(decimals));
      let depositToken = await exchangeContract.deposit(tokenBContract.address, amountDeposit);       
      let contractBalance = new BigNumber(await tokenBContract.balanceOf(exchangeContract.address));
      //assert.ok(depositToken);
      assert.strictEqual(amountDeposit.toNumber(), contractBalance.toNumber());

      let ownerBalance = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
      console.log('Amount = ', amountDeposit.toNumber());
      console.log('Contract balance after deposit = ', contractBalance.toNumber());
      console.log('Owner balance after deposit    = ', ownerBalance.toNumber());
    })

    it('Send token A to User', async () => {
      let amountAllowance = new BigNumber(15).times(new BigNumber(10).pow(decimals));
      let setAllowance = await tokenAContract.approve(exchangeContract.address, amountAllowance);
      
      let amountTransfer = new BigNumber(4).times(new BigNumber(10).pow(decimals));
      let sended = await tokenAContract.transfer(userAccount, amountTransfer);       
      let userBalance = new BigNumber(await tokenAContract.balanceOf(userAccount));
      assert.strictEqual(amountTransfer.toNumber(), userBalance.toNumber());

      let ownerBalance = new BigNumber(await tokenAContract.balanceOf(ownerAccount));
      console.log('Amount = ', amountTransfer.toNumber());
      console.log('User balance after deposit     = ', userBalance.toNumber());
      console.log('Owner balance after deposit    = ', ownerBalance.toNumber());
    })

    it('User set allowance token A', async () => {
      let amountUsrAllA = new BigNumber(20).times(new BigNumber(10).pow(decimals));
      let setAllowance = await tokenAContract.approve(exchangeContract.address, amountUsrAllA, {from: userAccount});
      assert.ok(setAllowance);
      let y = new BigNumber(await tokenAContract.allowance(userAccount, exchangeContract.address));
      console.log('Allowance A = ', y.toNumber());
    })

    it('User exchange token A', async () => {
      let start_A = new BigNumber(await tokenAContract.balanceOf(userAccount));
      let start_B = new BigNumber(await tokenBContract.balanceOf(userAccount));
      let _amountAllowance = new BigNumber(21).times(new BigNumber(10).pow(decimals));
      let setAllowance = await tokenAContract.approve(exchangeContract.address, _amountAllowance, {from: userAccount});

      let _amountExchange = new BigNumber(10).times(new BigNumber(10).pow(decimals));
      let exchangeDone = await exchangeContract.exchange(tokenAContract.address, _amountExchange, {from: userAccount});
      
      
      let end_A = new BigNumber(await tokenAContract.balanceOf(userAccount));
      let end_B = new BigNumber(await tokenBContract.balanceOf(userAccount));
      
      console.log('Start A = ', start_A.toNumber(), '   => Stop A = ', end_A.toNumber());
      console.log('Start B = ', start_B.toNumber(), '   => Stop B = ', end_B.toNumber());
      console.log('Price = ', price.toNumber());
    })

  })
})