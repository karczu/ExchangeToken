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
  const price = new BigNumber(2.52734).times(new BigNumber(10).pow(decimals));

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

    it('Set allowance token A', async () => {
      const amountAllA = new BigNumber(14.2576).times(new BigNumber(10).pow(decimals));
      const setAllowance = await tokenAContract.approve(exchangeContract.address, amountAllA);
      assert.ok(setAllowance);
      const _allA = new BigNumber(await tokenAContract.allowance(ownerAccount, exchangeContract.address));
      console.log('Allowance A = ', _allA.toNumber());
    })

    it('Set allowance token B', async () => {
      const amountAllB = new BigNumber(12.2576).times(new BigNumber(10).pow(decimals));
      const setAllowance = await tokenBContract.approve(exchangeContract.address, amountAllB);
      assert.ok(setAllowance);
      const _allB = new BigNumber(await tokenBContract.allowance(ownerAccount, exchangeContract.address));
      console.log('Allowance B = ', _allB.toNumber());
    })

    it('Deposit token B', async () => {
      const amountAllowance = new BigNumber(15).times(new BigNumber(10).pow(decimals));
      const setAllowance = await tokenBContract.approve(exchangeContract.address, amountAllowance);
      
      const amountDeposit = new BigNumber(12).times(new BigNumber(10).pow(decimals));
      const depositToken = await exchangeContract.deposit(tokenBContract.address, amountDeposit);       
      const contractBalance = new BigNumber(await tokenBContract.balanceOf(exchangeContract.address));
      assert.strictEqual(amountDeposit.toNumber(), contractBalance.toNumber());

      const ownerBalance = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
      console.log('Amount = ', amountDeposit.toNumber());
      console.log('Contract balance after deposit = ', contractBalance.toNumber());
      console.log('Owner balance after deposit    = ', ownerBalance.toNumber());
    })

    it('Send token A to User', async () => {
      const amountAllowance = new BigNumber(40).times(new BigNumber(10).pow(decimals));
      const setAllowance = await tokenAContract.approve(exchangeContract.address, amountAllowance);
      
      const amountTransfer = new BigNumber(4).times(new BigNumber(10).pow(decimals));
      const sended = await tokenAContract.transfer(userAccount, amountTransfer);       
      const userBalance = new BigNumber(await tokenAContract.balanceOf(userAccount));
      assert.strictEqual(amountTransfer.toNumber(), userBalance.toNumber());

      const ownerBalance = new BigNumber(await tokenAContract.balanceOf(ownerAccount));
      console.log('Amount = ', amountTransfer.toNumber());
      console.log('User balance after deposit     = ', userBalance.toNumber());
      console.log('Owner balance after deposit    = ', ownerBalance.toNumber());
    })
    
    it('User exchange token A -> B', async () => {
      const start_owner_A = new BigNumber(await tokenAContract.balanceOf(ownerAccount));
      const start_owner_B = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
      const start_user_A = new BigNumber(await tokenAContract.balanceOf(userAccount));
      const start_user_B = new BigNumber(await tokenBContract.balanceOf(userAccount));
      const start_contract_A = new BigNumber(await tokenAContract.balanceOf(exchangeContract.address));
      const start_contract_B = new BigNumber(await tokenBContract.balanceOf(exchangeContract.address));

      //Owner set allowance
      const _amountAllowance = new BigNumber(90).times(new BigNumber(10).pow(decimals));
      await tokenAContract.approve(exchangeContract.address, _amountAllowance);
      await tokenBContract.approve(exchangeContract.address, _amountAllowance);
      
      //Owner deposit B
      const amountDeposit = new BigNumber(50).times(new BigNumber(10).pow(decimals));
      await exchangeContract.deposit(tokenBContract.address, amountDeposit); 

      //Owner send A to user
      const amountTransfer = new BigNumber(45).times(new BigNumber(10).pow(decimals));
      await tokenAContract.transfer(userAccount, amountTransfer);  

      //User set allowance A
      const amountUsrAllowanceA = new BigNumber(45).times(new BigNumber(10).pow(decimals));
      await tokenAContract.approve(exchangeContract.address, amountUsrAllowanceA, {from: userAccount});

      //User exchange A -> B
      const amountExchange = new BigNumber(2).times(new BigNumber(10).pow(decimals));
      await exchangeContract.exchange(tokenAContract.address, amountExchange, {from: userAccount});
      
      const end_owner_A = new BigNumber(await tokenAContract.balanceOf(ownerAccount));
      const end_owner_B = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
      const end_user_A = new BigNumber(await tokenAContract.balanceOf(userAccount));
      const end_user_B = new BigNumber(await tokenBContract.balanceOf(userAccount));
      const end_contract_A = new BigNumber(await tokenAContract.balanceOf(exchangeContract.address));
      const end_contract_B = new BigNumber(await tokenBContract.balanceOf(exchangeContract.address));

      const tokenBfromA = amountExchange.multipliedBy(price).dividedBy(new BigNumber(10).pow(decimals));
      assert.strictEqual(tokenBfromA.toNumber(), end_user_B.toNumber());

      console.log('Price start = ', price.toNumber());
      console.log('--- Owner balance ---');
      console.log('Start A = ', start_owner_A.toNumber(), '   => Stop A = ', end_owner_A.toNumber());
      console.log('Start B = ', start_owner_B.toNumber(), '   => Stop B = ', end_owner_B.toNumber());
      console.log('--- User balance ---');
      console.log('Start A = ', start_user_A.toNumber(), '   => Stop A = ', end_user_A.toNumber());
      console.log('Start B = ', start_user_B.toNumber(), '   => Stop B = ', end_user_B.toNumber());
      console.log('--- Contract balance ---');
      console.log('Start A = ', start_contract_A.toNumber(), '   => Stop A = ', end_contract_A.toNumber());
      console.log('Start B = ', start_contract_B.toNumber(), '   => Stop B = ', end_contract_B.toNumber());
    })

    it('User exchange token B -> A', async () => {
      const start_owner_A = new BigNumber(await tokenAContract.balanceOf(ownerAccount));
      const start_owner_B = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
      const start_user_A = new BigNumber(await tokenAContract.balanceOf(userAccount));
      const start_user_B = new BigNumber(await tokenBContract.balanceOf(userAccount));
      const start_contract_A = new BigNumber(await tokenAContract.balanceOf(exchangeContract.address));
      const start_contract_B = new BigNumber(await tokenBContract.balanceOf(exchangeContract.address));

      //Owner set allowance
      const _amountAllowance = new BigNumber(90).times(new BigNumber(10).pow(decimals));
      await tokenAContract.approve(exchangeContract.address, _amountAllowance);
      await tokenBContract.approve(exchangeContract.address, _amountAllowance);
      
      //Owner deposit A
      const amountDeposit = new BigNumber(60).times(new BigNumber(10).pow(decimals));
      await exchangeContract.deposit(tokenAContract.address, amountDeposit); 

      //Owner send B to user
      const amountTransfer = new BigNumber(30).times(new BigNumber(10).pow(decimals));
      await tokenBContract.transfer(userAccount, amountTransfer);  

      //User set allowance B
      const amountUsrAllowanceA = new BigNumber(60).times(new BigNumber(10).pow(decimals));
      await tokenBContract.approve(exchangeContract.address, amountUsrAllowanceA, {from: userAccount});

      //User exchange B -> A
      const amountExchange = new BigNumber(12).times(new BigNumber(10).pow(decimals));
      await exchangeContract.exchange(tokenBContract.address, amountExchange, {from: userAccount});
      
      const end_owner_A = new BigNumber(await tokenAContract.balanceOf(ownerAccount));
      const end_owner_B = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
      const end_user_A = new BigNumber(await tokenAContract.balanceOf(userAccount));
      const end_user_B = new BigNumber(await tokenBContract.balanceOf(userAccount));
      const end_contract_A = new BigNumber(await tokenAContract.balanceOf(exchangeContract.address));
      const end_contract_B = new BigNumber(await tokenBContract.balanceOf(exchangeContract.address));

      const tokenAfromB = amountExchange.multipliedBy(new BigNumber(10).pow(decimals)).dividedBy(price);
      assert.strictEqual(tokenAfromB.toNumber(), end_user_A.toNumber());

      console.log('Price start = ', price.toNumber());
      console.log('--- Owner balance ---');
      console.log('Start A = ', start_owner_A.toNumber(), '   => Stop A = ', end_owner_A.toNumber());
      console.log('Start B = ', start_owner_B.toNumber(), '   => Stop B = ', end_owner_B.toNumber());
      console.log('--- User balance ---');
      console.log('Start A = ', start_user_A.toNumber(), '   => Stop A = ', end_user_A.toNumber());
      console.log('Start B = ', start_user_B.toNumber(), '   => Stop B = ', end_user_B.toNumber());
      console.log('--- Contract balance ---');
      console.log('Start A = ', start_contract_A.toNumber(), '   => Stop A = ', end_contract_A.toNumber());
      console.log('Start B = ', start_contract_B.toNumber(), '   => Stop B = ', end_contract_B.toNumber());
    })

    it('Owner can change price', async () => {
      const newPrice = new BigNumber(14.3652).times(new BigNumber(10).pow(decimals));
      const priceUpdate = await exchangeContract.updatePrice(newPrice);
      assert.ok(priceUpdate);

      const priceUpdated = new BigNumber(await exchangeContract.price.call());
      assert.strictEqual(priceUpdated.toNumber(), newPrice.toNumber());
      
      console.log('price default = ', price.toNumber());
      console.log('price updated = ', priceUpdated.toNumber());
    })

    it('User exchange token B -> A with not enough balance - SHOULD FAIL', async () => {
      const start_owner_A = new BigNumber(await tokenAContract.balanceOf(ownerAccount));
      const start_owner_B = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
      const start_user_A = new BigNumber(await tokenAContract.balanceOf(userAccount));
      const start_user_B = new BigNumber(await tokenBContract.balanceOf(userAccount));
      const start_contract_A = new BigNumber(await tokenAContract.balanceOf(exchangeContract.address));
      const start_contract_B = new BigNumber(await tokenBContract.balanceOf(exchangeContract.address));

      //Owner set allowance
      const _amountAllowance = new BigNumber(90).times(new BigNumber(10).pow(decimals));
      await tokenAContract.approve(exchangeContract.address, _amountAllowance);
      await tokenBContract.approve(exchangeContract.address, _amountAllowance);
      
      //Owner deposit A
      const amountDeposit = new BigNumber(2).times(new BigNumber(10).pow(decimals));
      await exchangeContract.deposit(tokenAContract.address, amountDeposit); 

      //Owner send B to user
      const amountTransfer = new BigNumber(30).times(new BigNumber(10).pow(decimals));
      await tokenBContract.transfer(userAccount, amountTransfer);  

      //User set allowance B
      const amountUsrAllowanceA = new BigNumber(60).times(new BigNumber(10).pow(decimals));
      await tokenBContract.approve(exchangeContract.address, amountUsrAllowanceA, {from: userAccount});

      //User exchange B -> A
      const amountExchange = new BigNumber(12).times(new BigNumber(10).pow(decimals));
      await exchangeContract.exchange(tokenBContract.address, amountExchange, {from: userAccount});
      
      const end_owner_A = new BigNumber(await tokenAContract.balanceOf(ownerAccount));
      const end_owner_B = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
      const end_user_A = new BigNumber(await tokenAContract.balanceOf(userAccount));
      const end_user_B = new BigNumber(await tokenBContract.balanceOf(userAccount));
      const end_contract_A = new BigNumber(await tokenAContract.balanceOf(exchangeContract.address));
      const end_contract_B = new BigNumber(await tokenBContract.balanceOf(exchangeContract.address));

      const tokenAfromB = amountExchange.multipliedBy(new BigNumber(10).pow(decimals)).dividedBy(price);
      assert.strictEqual(tokenAfromB.toNumber(), end_user_A.toNumber());

      console.log('Price start = ', price.toNumber());
      console.log('--- Owner balance ---');
      console.log('Start A = ', start_owner_A.toNumber(), '   => Stop A = ', end_owner_A.toNumber());
      console.log('Start B = ', start_owner_B.toNumber(), '   => Stop B = ', end_owner_B.toNumber());
      console.log('--- User balance ---');
      console.log('Start A = ', start_user_A.toNumber(), '   => Stop A = ', end_user_A.toNumber());
      console.log('Start B = ', start_user_B.toNumber(), '   => Stop B = ', end_user_B.toNumber());
      console.log('--- Contract balance ---');
      console.log('Start A = ', start_contract_A.toNumber(), '   => Stop A = ', end_contract_A.toNumber());
      console.log('Start B = ', start_contract_B.toNumber(), '   => Stop B = ', end_contract_B.toNumber());
    })

    it('Deposit token B with wrong address - SHOULD FAIL', async () => {
      const amountAllowance = new BigNumber(15).times(new BigNumber(10).pow(decimals));
      await tokenBContract.approve(exchangeContract.address, amountAllowance);
      
      const amountDeposit = new BigNumber(12).times(new BigNumber(10).pow(decimals));
      await exchangeContract.deposit(tokenBContract.address, amountDeposit);       
      const contractBalance = new BigNumber(await tokenBContract.balanceOf(tokenBContract.address));

      assert.strictEqual(amountDeposit.toNumber(), contractBalance.toNumber());

      const ownerBalance = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
      console.log('Amount = ', amountDeposit.toNumber());
      console.log('Contract balance after deposit = ', contractBalance.toNumber());
      console.log('Owner balance after deposit    = ', ownerBalance.toNumber());
    })

    // it('User exchange token A -> B WITH DIFFERENT DECIMALS', async () => {
    //   const start_owner_A = new BigNumber(await tokenAContract.balanceOf(ownerAccount));
    //   const start_owner_B = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
    //   const start_user_A = new BigNumber(await tokenAContract.balanceOf(userAccount));
    //   const start_user_B = new BigNumber(await tokenBContract.balanceOf(userAccount));
    //   const start_contract_A = new BigNumber(await tokenAContract.balanceOf(exchangeContract.address));
    //   const start_contract_B = new BigNumber(await tokenBContract.balanceOf(exchangeContract.address));

    //   //Owner set allowance
    //   const _amountAllowance = new BigNumber(90).times(new BigNumber(10).pow(decimals));
    //   await tokenAContract.approve(exchangeContract.address, _amountAllowance);
    //   await tokenBContract.approve(exchangeContract.address, _amountAllowance);
      
    //   //Owner deposit B
    //   const amountDeposit = new BigNumber(50).times(new BigNumber(10).pow(9));
    //   await exchangeContract.deposit(tokenBContract.address, amountDeposit); 

    //   //Owner send A to user
    //   const amountTransfer = new BigNumber(45).times(new BigNumber(10).pow(decimals));
    //   await tokenAContract.transfer(userAccount, amountTransfer);  

    //   //User set allowance A
    //   const amountUsrAllowanceA = new BigNumber(45).times(new BigNumber(10).pow(decimals));
    //   await tokenAContract.approve(exchangeContract.address, amountUsrAllowanceA, {from: userAccount});

    //   //User exchange A -> B
    //   const amountExchange = new BigNumber(2).times(new BigNumber(10).pow(decimals));
    //   await exchangeContract.exchange(tokenAContract.address, amountExchange, {from: userAccount});
      
    //   const end_owner_A = new BigNumber(await tokenAContract.balanceOf(ownerAccount));
    //   const end_owner_B = new BigNumber(await tokenBContract.balanceOf(ownerAccount));
    //   const end_user_A = new BigNumber(await tokenAContract.balanceOf(userAccount));
    //   const end_user_B = new BigNumber(await tokenBContract.balanceOf(userAccount));
    //   const end_contract_A = new BigNumber(await tokenAContract.balanceOf(exchangeContract.address));
    //   const end_contract_B = new BigNumber(await tokenBContract.balanceOf(exchangeContract.address));

    //   const tokenBfromA = amountExchange.multipliedBy(price).dividedBy(new BigNumber(10).pow(decimals));
    //   tokenBfromA = tokenBfromA.dividedBy(new BigNumber(10).pow(9));
    //   assert.strictEqual(tokenBfromA.toNumber(), end_user_B.toNumber());

    //   console.log('Price start = ', price.toNumber());
    //   console.log('--- Owner balance ---');
    //   console.log('Start A = ', start_owner_A.toNumber(), '   => Stop A = ', end_owner_A.toNumber());
    //   console.log('Start B = ', start_owner_B.toNumber(), '   => Stop B = ', end_owner_B.toNumber());
    //   console.log('--- User balance ---');
    //   console.log('Start A = ', start_user_A.toNumber(), '   => Stop A = ', end_user_A.toNumber());
    //   console.log('Start B = ', start_user_B.toNumber(), '   => Stop B = ', end_user_B.toNumber());
    //   console.log('--- Contract balance ---');
    //   console.log('Start A = ', start_contract_A.toNumber(), '   => Stop A = ', end_contract_A.toNumber());
    //   console.log('Start B = ', start_contract_B.toNumber(), '   => Stop B = ', end_contract_B.toNumber());
    // })
  })
})