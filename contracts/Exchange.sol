pragma solidity ^0.8.0;

// compile problem with 'import "@openzeppelin/contracts/token/ERC20/ERC20.sol"';
import "../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Exchange is Ownable {
  uint256 private _decimals = 18;
  uint256 private _amountWei = 10**_decimals;
  uint256 private _decimalsDiff = 0;
  uint256 private _decA;
  uint256 private _decB;
  uint256 private _rate = 1;
  uint256 public price;
  address public addressTknA;
  address public addressTknB;

  event ExchangeTokenEvent(address _user, address _token, uint256 _amountSell);

  constructor(address tokenAddressA, address tokenAddressB, uint256 priceAB) {
    addressTknA = tokenAddressA;
    addressTknB = tokenAddressB;
    price = priceAB;
    _decA = (ERC20(addressTknA)).decimals();
    _decB = (ERC20(addressTknB)).decimals();

    //check if tokens have the same or different decimals
    if(_decA>_decB){
      _decimalsDiff = _decA - _decB;
    }else if(_decA<_decB){
      _decimalsDiff = _decB - _decA;
    }
    //used if tokens have different decimals
    _rate = 10**_decimalsDiff;
  }
    
  
function exchange(address tokenAddress, uint256 amount) public {
  if (tokenAddress == addressTknA){
    uint256 _amountBuyTkn = (amount * price) / _amountWei;
    if(_decA>_decB){
      _amountBuyTkn /= _rate;
    }else if(_decA<_decB){
      _amountBuyTkn *= _rate;
    }
    _exchangeHelper(addressTknA, addressTknB, amount, _amountBuyTkn);
    emit ExchangeTokenEvent(msg.sender, tokenAddress, amount);
  }else if(tokenAddress == addressTknB){
    uint256 _amountBuyTkn = (amount * _amountWei) / price;
    if(_decA>_decB){
      _amountBuyTkn *= _rate;
    }else if(_decA<_decB){
      _amountBuyTkn /= _rate;
    }
    _exchangeHelper(addressTknB, addressTknA, amount, _amountBuyTkn);
    emit ExchangeTokenEvent(msg.sender, tokenAddress, amount);
  }
}

function updatePrice(uint256 newPrice) public onlyOwner {
  require(newPrice > 0, "New price needs to be over zero!");
  price = newPrice;
}
  
function deposit(address tokenAddress, uint256 amount) public onlyOwner {
  require(amount > 0, "Deposit amount needs to be over zero!");
  assert(ERC20(tokenAddress).transferFrom(msg.sender, address(this), amount));
}
  
function _exchangeHelper(address sellTkn, address buyTkn, uint256 amountSellTkn, uint256 amountBuyTkn) private {
  // sell amount >0
  require(amountSellTkn > 0, "Amount of token needs to be over zero!");
  // enough sell amount on user balance
  uint256 balanceSenderToken = ERC20(sellTkn).balanceOf(msg.sender);
  require(balanceSenderToken > amountSellTkn, "User balance too low!");
  // enough buy amount on contract balance
  uint256 balanceBuyToken = ERC20(buyTkn).balanceOf(address(this));
  require(balanceBuyToken > amountBuyTkn, "Contract balance too low!");

  // sell sellTkn
  assert(ERC20(sellTkn).transferFrom(msg.sender, address(this), amountSellTkn));
  // buy buyTkn
  assert(ERC20(buyTkn).transfer(msg.sender, amountBuyTkn));
  }
}