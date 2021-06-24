pragma solidity ^0.8.0;

import "../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract TokenA is Ownable, ERC20 {

  uint256 initSupply = 21 * (10 ** decimals());
    
    constructor(
    ) public ERC20("TokenA", "TKNA") {
        mint(msg.sender, initSupply);
    }
    
     function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
     }
}
