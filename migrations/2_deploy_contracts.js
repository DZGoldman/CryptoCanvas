var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var InkToken = artifacts.require("./InkToken.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(InkToken, 90000, 'InkToken', 'Ink', {from:"0xf17f52151ebef6c7334fad080c5704d77216b732"});
};

