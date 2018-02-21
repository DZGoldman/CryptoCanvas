var InkToken = artifacts.require("./InkToken.sol");
var CanvasToken = artifacts.require("./Canvas.sol");
var Crowdsale = artifacts.require("./CrowdSale.sol");


var scale = (10**18)
var balance
contract('InkToken', function(accounts) {
  var fromAddress =  accounts[1]
  var otherAddress = accounts[0]
  it("token",async  function() {
    const instance = await InkToken.deployed();
    const crowdsale = await Crowdsale.deployed();

    const by = await instance.getCanvasBytes.call()
    balance = await instance.getBalance.call(fromAddress)
    assert.equal(balance.valueOf(), 90000*scale, "initial supply");
    
    await instance.burn(80000*scale, {from: fromAddress })
    balance = await instance.getBalance.call(fromAddress)
    assert.equal(balance.valueOf(), 10000*scale, "burn works");
    
    await instance.transfer(otherAddress, 5000 *scale, {from: fromAddress})
    balance = await instance.getBalance.call(otherAddress)
    assert.equal(balance.valueOf(), 5000*scale, "transfer works");

    // await instance.transfer(otherAddress, 0.3 *scale, {from: fromAddress})

    // console.log('asdf',web3.fromWei(web3.eth.getBalance(otherAddress).valueOf(), 'ether'  ))
    // var amount = web3.toWei(10, "ether")
    // console.log(crowdsale.address)
    // // web3.eth.sendTransaction({from: otherAddress, to: crowdsale.address})
    // balance = await instance.getBalance.call(otherAddress)
    // console.log('balacne', balance.valueOf())
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
