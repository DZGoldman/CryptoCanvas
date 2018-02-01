var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var InkToken = artifacts.require("./InkToken.sol");
var Crowdsale = artifacts.require("./CrowdSale.sol");
var Canvas = artifacts.require("Canvas");
var Crowdsale = artifacts.require("CrowdSale");
var SimpleStorage = artifacts.require("SimpleStorage");
var InkToken = artifacts.require("InkToken");

var fromAddress = "0xf17f52151ebef6c7334fad080c5704d77216b732"
var otherAddress = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"

// NOTE: network argument can be used for different deployments in different environments
module.exports = function(deployer, network, accounts) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Crowdsale, fromAddress, 50000, 50000, 2, fromAddress);

  deployer.deploy(Canvas);
  deployer.deploy(InkToken, 90000, 'InkToken', 'Ink', {from: fromAddress}).then(function() {
    return deployer.deploy(Canvas, InkToken.address);
  });

};

