pragma solidity ^0.8.0;

// compile problem with import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract TokenA is Ownable, ERC20 {

  uint256 initSupply = 99 * (10 ** decimals());
    
    constructor(
    ) ERC20("TokenA", "TKNA") {
        mint(msg.sender, initSupply);
    }
    
    function mint(address account, uint256 amount) public onlyOwner {
      _mint(account, amount);
    }

    function decimals() public view virtual override returns (uint8) {
      return 18;
    }

}
