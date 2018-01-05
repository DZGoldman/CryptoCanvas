var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var InkToken = artifacts.require("./InkToken.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(InkToken);
};
