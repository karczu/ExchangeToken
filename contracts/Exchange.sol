pragma solidity ^0.8.0;

import "../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Exchange is Ownable {
  uint256 private _decimal = 18;
  uint public amountWei = 10**_decimal;
  uint public price = 17318200000000000000;
  address public addressTknA;
  address public addressTknB;

  event ExchangeTokenEvent(address _user, address _token, uint _amountSell);

  constructor(address tokenAddressA, address tokenAddressB, uint priceAB) {
    addressTknA = tokenAddressA;
    addressTknB = tokenAddressB;
    price = priceAB;
  }
  
function exchange(address tokenAddress, uint amount) public returns (bool success){
  if (tokenAddress == addressTknA){
    uint _amountBuyTkn = (amount * price) / amountWei;
    exchangeHelper(addressTknA, addressTknB, amount, _amountBuyTkn);
    emit ExchangeTokenEvent(msg.sender, tokenAddress, amount);
    return true;
  }else if(tokenAddress == addressTknB){
    uint _amountBuyTkn = (amount * amountWei) / price ; 
    exchangeHelper(addressTknB, addressTknA, amount, _amountBuyTkn);
    emit ExchangeTokenEvent(msg.sender, tokenAddress, amount);
    return true;
  }else{
    return false;
  }
  }
  
  function exchangeHelper(address sellTkn, address buyTkn, uint amountSellTkn, uint amountBuyTkn) public payable returns (bool success){
    // sell amount >0
    require(amountSellTkn > 0, "Amount of token needs to be over zero!");
    // enough sell amount on user balance
    uint balanceSenderToken = ERC20(sellTkn).balanceOf(msg.sender);
    require(balanceSenderToken > amountSellTkn, "User balance too low!");
    // enough buy amount on contract balance
    uint balanceBuyToken = ERC20(buyTkn).balanceOf(address(this));
    require(balanceBuyToken > amountBuyTkn, "Contract balance too low!");
        
    // sell sellTkn
    assert(ERC20(sellTkn).transferFrom(msg.sender, address(this), amountSellTkn));
    // buy buyTkn
    assert(ERC20(buyTkn).transfer(msg.sender, amountBuyTkn));
    return true;
  }


  function updatePrice(uint newPrice) public onlyOwner returns (bool success) {
    require(newPrice > 0, "New price needs to be over zero!");
    price = newPrice;
    return true;
  }
  
  function deposit(address tokenAddress, uint amount) public onlyOwner payable returns (bool success) {
    require(amount > 0, "Deposit amount needs to be over zero!");
    assert(ERC20(tokenAddress).transferFrom(msg.sender, address(this), amount));
    return true;
  }
}