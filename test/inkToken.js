var InkToken = artifacts.require("./InkToken.sol");
var CanvasToken = artifacts.require("./Canvas.sol");
var Crowdsale = artifacts.require("./CrowdSale.sol");


var scale = (10**18)
var balance;

contract('InkToken', function(accounts) {
  var fromAddress =  accounts[1]
  var otherAddress = accounts[0]
  it("token",async  function() {
    const instance = await InkToken.deployed();
    balance = await instance.getBalance.call(fromAddress)
    var supply = await instance.totalSupply.call()
    supply = supply.valueOf()
    // balance and supply arent' equal beacuse some is sent to crowdsale
    // assert.equal(balance.valueOf(), supply, "initial supply");
    
    
    await instance.burn(80000*scale, {from: fromAddress })
    balance = await instance.getBalance.call(fromAddress)
    assert.equal(balance.valueOf(), 10000*scale, "burn works");
    
    await instance.transfer(otherAddress, 5000 *scale, {from: fromAddress})
    balance = await instance.getBalance.call(otherAddress)
    assert.equal(balance.valueOf(), 5000*scale, "transfer works");

  });
});

contract('Crowdsale', function(accounts) {
  var fromAddress =  accounts[1]
  var otherAddress = accounts[0]
  it("token",async  function() {
    const instance = await InkToken.deployed();
    const crowdsale = await Crowdsale.deployed();
    
    // initial vars/consts
    var price =   await crowdsale.price.call()
    price = price.valueOf()
    var amountEthToSend = web3.toWei(2, "ether")
    var balancePre = await  web3.eth.getBalance(otherAddress);
    balancePre = balancePre.valueOf()


    // send transaction for fundraising
    await crowdsale.sendTransaction({from: otherAddress, value: amountEthToSend})
    // retrieve vars
    var balancePost = await  web3.eth.getBalance(otherAddress);
    balancePost = balancePost.valueOf()
    const raised = await crowdsale.balanceOf.call(otherAddress)
    var tokenBalance = await instance.getBalance.call(otherAddress)
    tokenBalance = tokenBalance.valueOf()

    assert.equal(balancePre > balancePost, true, 'eth sent')
    assert.equal(raised.valueOf(), amountEthToSend, "eth added to fundraising stash");
    assert.equal(tokenBalance, amountEthToSend/price, "right # of tokens awarded");

  
  });
});







// contract('Canvas', function(accounts) {
//     var fromAddress =  accounts[1]
//   var otherAddress = accounts[0]
//   it("...basic things.",async  function() {

//     const instance = await InkToken.deployed();

//      const canvas = await CanvasToken.deployed()
//          balance = await instance.getBalance.call(fromAddress)
//       console.log('pre', balance.valueOf())
//       await canvas.drawString('bull', {from: fromAddress,  gas: 5200000})
//       console.log('post', balance.valueOf())

//       const string = await canvas.getCanvasString.call()
//       assert.equal(string.valueOf(), 'bull', "transfer works");

//     });
//   })
