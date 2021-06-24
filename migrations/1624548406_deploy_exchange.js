const TokenA = artifacts.require("TokenA");
const TokenB = artifacts.require("TokenB");
const Exchange = artifacts.require("Exchange");

module.exports = async function(deployer) {
  let _price = 2000;
  let _addA = await deployer.deploy(TokenA);
  let _addB = await deployer.deploy(TokenB);
  await deployer.deploy(Exchange, TokenA.address, TokenB.address, _price);
};
