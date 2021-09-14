var ERC20Token = artifacts.require("./ERC20Token.sol")

module.exports = function(deployer) {
  deployer.deploy(ERC20Token,"Bitcoin","BTC",2,100);

};
