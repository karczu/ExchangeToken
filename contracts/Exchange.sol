pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is Ownable {
  uint256 private _decimal = 18;
  uint public amountWei = 10**_decimal;
  uint public price;
  address public addressTknA;
  address public addressTknB;

  event ExchangeTokenEvent(address _user, address _token, uint _amountSell);

  constructor(address tokenAddressA, address tokenAddressB, uint priceAB) {
    addressTknA = tokenAddressA;
    addressTknB = tokenAddressB;
    price = priceAB;
  }
    
  
function exchange(address tokenAddress, uint amount) public {
  if (tokenAddress == addressTknA){
    uint _amountBuyTkn = (amount * price) / amountWei;
    _exchangeHelper(addressTknA, addressTknB, amount, _amountBuyTkn);
    emit ExchangeTokenEvent(msg.sender, tokenAddress, amount);
  }else if(tokenAddress == addressTknB){
    uint _amountBuyTkn = (amount * amountWei) / price ; 
    _exchangeHelper(addressTknB, addressTknA, amount, _amountBuyTkn);
    emit ExchangeTokenEvent(msg.sender, tokenAddress, amount);
  }
  }


  function updatePrice(uint newPrice) public onlyOwner {
    require(newPrice > 0, "New price needs to be over zero!");
    price = newPrice;
  }
  
  function deposit(address tokenAddress, uint amount) public onlyOwner {
    require(amount > 0, "Deposit amount needs to be over zero!");
    assert(ERC20(tokenAddress).transferFrom(msg.sender, address(this), amount));
  }
  
    function _exchangeHelper(address sellTkn, address buyTkn, uint amountSellTkn, uint amountBuyTkn) private {
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
  }
}