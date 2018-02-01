var InkToken = artifacts.require("./InkToken.sol");
var CanvasToken = artifacts.require("./Canvas.sol");
var Crowdsale = artifacts.require("./CrowdSale.sol");


var fromAddress = "0xf17f52151ebef6c7334fad080c5704d77216b732"
var otherAddress = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
var scale = (10**18)
var balance
contract('InkToken', function(accounts) {
  
  it("token",async  function() {
    const instance = await InkToken.deployed();
    const crowdsale = await Crowdsale.deployed();

    // const by = await instance.getCanvasBytes.call()
    // balance = await instance.getBalance.call(fromAddress)
    // assert.equal(balance.valueOf(), 9*scale, "initial supply");
    
    // await instance.burn(8*scale, {from: fromAddress })
    // balance = await instance.getBalance.call(fromAddress)
    // assert.equal(balance.valueOf(), 1*scale, "burn works");
    
    await instance.transfer(otherAddress, 0.3 *scale, {from: fromAddress})
    balance = await instance.getBalance.call(otherAddress)
    assert.equal(balance.valueOf(), 0.3*scale, "transfer works");

    // await instance.transfer(otherAddress, 0.3 *scale, {from: fromAddress})

    console.log('asdf',web3.fromWei(web3.eth.getBalance(otherAddress).valueOf(), 'ether'  ))
    var amount = web3.toWei(10, "ether")
    web3.eth.sendTransaction({from: otherAddress, to: crowdsale.address, gas:21000})
    balance = await instance.getBalance.call(otherAddress)
    console.log('balacne', balance)
  });
});




// contract('Canvas', function(accounts) {
//   it("...basic things.",async  function() {
//     const instance = await InkToken.deployed();

//      const canvas = await CanvasToken.deployed()
//          balance = await instance.getBalance.call(fromAddress)
//       console.log('pre', balance.valueOf())
//       await canvas.drawString('bull', {from: fromAddress,  gas: 5200000})
//       console.log('post', balance)

//       const string = await canvas.getCanvasString.call()
//       assert.equal(string.valueOf(), 'bull', "transfer works");

//     });
//   })
