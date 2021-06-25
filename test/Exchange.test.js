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

    // it('Deploys the contract Token A', async () => {
    //   assert.ok(tokenAContract.address);
    //   console.log('Token A address = ', tokenAContract.address);
    // })

    // it('Deploys the contract Token B', async () => {
    //   assert.ok(tokenBContract.address);
    //   console.log('Token B address = ', tokenBContract.address);
    // })

    // it('Deploys the Exchange contract', async () => {
    //   assert.ok(exchangeContract.address);
    //   console.log('Exchange token address = ', exchangeContract.address);
    // })

    // it('Set allowance token A', async () => {
    //   let amountAllA = new BigNumber(14.2576).times(new BigNumber(10).pow(decimals));
    //   let setAllowance = await tokenAContract.approve(exchangeContract.address, amountAllA);
    //   assert.ok(setAllowance);
    // })

    // it('Set allowance token B', async () => {
    //   let amountAllB = new BigNumber(12.2576).times(new BigNumber(10).pow(decimals));
    //   let setAllowance = await tokenBContract.approve(exchangeContract.address, amountAllB);
    //   assert.ok(setAllowance);
    //   let y = new BigNumber(await tokenBContract.allowance(ownerAccount, exchangeContract.address));
    //   console.log('allowance b = ', y.toNumber());
    // })

    // it('Deposit token B', async () => {
    //   let amountAllowance = new BigNumber(15).times(new BigNumber(10).pow(decimals));
    //   let setAllowance = await tokenBContract.approve(exchangeContract.address, amountAllowance);
      
    //   let amountDeposit = new BigNumber(12).times(new BigNumber(10).pow(decimals));
    //   let depositToken = await exchangeContract.deposit(tokenBContract.address, amountDeposit);       
    //   let contractBalance = new BigNumber(await tokenBContract.balanceOf(exchangeContract.address));
    //   //assert.ok(depositToken);
    //   assert.strictEqual(amountDeposit.toNumber(), contractBalance.toNumber());

    //   let ownerBalance = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
    //   console.log('Amount = ', amountDeposit.toNumber());
    //   console.log('Contract balance after deposit = ', contractBalance.toNumber());
    //   console.log('Owner balance after deposit    = ', ownerBalance.toNumber());
    // })

    // it('Send token A to User', async () => {
    //   let amountAllowance = new BigNumber(40).times(new BigNumber(10).pow(decimals));
    //   let setAllowance = await tokenAContract.approve(exchangeContract.address, amountAllowance);
      
    //   let amountTransfer = new BigNumber(4).times(new BigNumber(10).pow(decimals));
    //   let sended = await tokenAContract.transfer(userAccount, amountTransfer);       
    //   let userBalance = new BigNumber(await tokenAContract.balanceOf(userAccount));
    //   assert.strictEqual(amountTransfer.toNumber(), userBalance.toNumber());

    //   let ownerBalance = new BigNumber(await tokenAContract.balanceOf(ownerAccount));
    //   console.log('Amount = ', amountTransfer.toNumber());
    //   console.log('User balance after deposit     = ', userBalance.toNumber());
    //   console.log('Owner balance after deposit    = ', ownerBalance.toNumber());
    // })

    // it('User set allowance token A', async () => {
    //   let amountUsrAllA = new BigNumber(20).times(new BigNumber(10).pow(decimals));
    //   let setAllowance = await tokenAContract.approve(exchangeContract.address, amountUsrAllA, {from: userAccount});
    //   assert.ok(setAllowance);
    //   let y = new BigNumber(await tokenAContract.allowance(userAccount, exchangeContract.address));
    //   console.log('Allowance A = ', y.toNumber());
    // })

    it('User exchange token A', async () => {
      let start_owner_A = new BigNumber(await tokenAContract.balanceOf(ownerAccount));
      let start_owner_B = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
      let start_user_A = new BigNumber(await tokenAContract.balanceOf(userAccount));
      let start_user_B = new BigNumber(await tokenBContract.balanceOf(userAccount));

      //Owner set allowance
      let _amountAllowance = new BigNumber(90).times(new BigNumber(10).pow(decimals));
      await tokenAContract.approve(exchangeContract.address, _amountAllowance);
      await tokenBContract.approve(exchangeContract.address, _amountAllowance);
      
      //Owner deposit B
      let amountDeposit = new BigNumber(50).times(new BigNumber(10).pow(decimals));
      await exchangeContract.deposit(tokenBContract.address, amountDeposit); 

      //Owner send A to user
      let amountTransfer = new BigNumber(45).times(new BigNumber(10).pow(decimals));
      await tokenAContract.transfer(userAccount, amountTransfer);  

      //User set allowance A
      let amountUsrAllowanceA = new BigNumber(45).times(new BigNumber(10).pow(decimals));
      await tokenAContract.approve(exchangeContract.address, amountUsrAllowanceA, {from: userAccount});

      let amountExchange = new BigNumber(2).times(new BigNumber(10).pow(decimals));
      await exchangeContract.exchange(tokenAContract.address, amountExchange, {from: userAccount});
      
      let end_owner_A = new BigNumber(await tokenAContract.balanceOf(ownerAccount));
      let end_owner_B = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
      let end_user_A = new BigNumber(await tokenAContract.balanceOf(userAccount));
      let end_user_B = new BigNumber(await tokenBContract.balanceOf(userAccount));

      let tokenBfromA = amountExchange.multipliedBy(price).dividedBy(new BigNumber(10).pow(decimals));
      assert.strictEqual(tokenBfromA.toNumber(), end_user_B.toNumber());
      //assert.ok(true);

      console.log('Price start = ', price.toNumber());
      console.log('--- Owner balance ---');
      console.log('Start A = ', start_owner_A.toNumber(), '   => Stop A = ', end_owner_A.toNumber());
      console.log('Start B = ', start_owner_B.toNumber(), '   => Stop B = ', end_owner_B.toNumber());
      console.log('--- User balance ---');
      console.log('Start A = ', start_user_A.toNumber(), '   => Stop A = ', end_user_A.toNumber());
      console.log('Start B = ', start_user_B.toNumber(), '   => Stop B = ', end_user_B.toNumber());
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

  })
})