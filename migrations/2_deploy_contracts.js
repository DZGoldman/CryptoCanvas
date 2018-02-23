var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var InkToken = artifacts.require("./InkToken.sol");
var Crowdsale = artifacts.require("./CrowdSale.sol");
var Canvas = artifacts.require("Canvas");
var Crowdsale = artifacts.require("CrowdSale");
var SimpleStorage = artifacts.require("SimpleStorage");
var InkToken = artifacts.require("InkToken");


// NOTE: network argument can be used for different deployments in different environments
module.exports = function(deployer, network, accounts) {
  var fromAddress =  accounts[1]
  var otherAddress = accounts[0]
  deployer.deploy(SimpleStorage);
  
  deployer.deploy(InkToken, 90000, 'InkToken', 'Ink', {from: fromAddress}).then(function() {
    deployer.deploy(Crowdsale, fromAddress, 50000, 525600, 2, InkToken.address).then(async function() {
      var i = await InkToken.deployed()
      await i.transfer(Crowdsale.address, 40000, {from: fromAddress})
    })
      return deployer.deploy(Canvas, InkToken.address).then(async function(){
        var i = await InkToken.deployed()
        await  i.approve(Canvas.address, 10000)
      })
  });

};
