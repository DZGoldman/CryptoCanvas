var Plot = artifacts.require("./Plot.sol");
const allEqual = function(array, value) {
    for(var i = 0; i < array.length; i++){
        if (array[i] !== value){
            return false
        }
    }
    return true
}

contract('Plot', function(accounts) {
    var fromAddress =  accounts[1]
    var otherAddress = accounts[0]
    var nullAddress = '0x0000000000000000000000000000000000000000'
    it("initial values tests",async  function() {
        const instance = await Plot.deployed();
        const plotOwner = await instance.plotOwners.call(0);
        assert.equal(plotOwner, nullAddress, "got null address");

        const plotOwnersFull = await instance.getPlotOwners.call()
        assert.isOk(allEqual(plotOwnersFull, nullAddress), "addresses all null");

        var  plotStatuses = await instance.getPlotStatuses.call();
        assert.isOk(allEqual(plotStatuses, false), "statuses all not for sale");

        var  plotPrices = await instance.getPlotPrices.call();
        plotPrices = plotPrices.map(function(price){
            return Number(price.valueOf())
        })
        assert.isOk(allEqual(plotPrices, 0), "prices all zero");
        
        var  admin = await instance.getAdmin.call();
        assert.equal(admin, fromAddress, "admin set")

        // const plotOwnersArray = await instance.getPlotOwners.call() 
        // console.log(plotOwnersArray)
    //   balance = await instance.getBalance.getcall(fromAddress)
    //   var supply = await instance.totalSupply.call()
    //   supply = supply.valueOf()
    //   // balance and supply arent' equal beacuse some is sent to crowdsale
    //   // assert.equal(balance.valueOf(), supply, "initial supply");
      
  
    //   await instance.burn(80000*scale, {from: fromAddress })
    //   balance = await instance.getBalance.call(fromAddress)
    //   assert.equal(balance.valueOf(), 10000*scale, "burn works");
      
    //   await instance.transfer(otherAddress, 5000 *scale, {from: fromAddress})
    //   balance = await instance.getBalance.call(otherAddress)
    //   assert.equal(balance.valueOf(), 5000*scale, "transfer works");
  
    
  });
  it("sales test",async  function() {
    const instance = await Plot.deployed();
    await instance.setPlotStatus(1, true, {from: fromAddress});
    var  plotStatuses = await instance.getPlotStatuses.call();
    assert.isOk(plotStatuses[1], "plot 1 now for sale");

    await instance.setPlotPrice(1, web3.toWei(5, "ether"), {from: fromAddress});
    var  plotPrice = await instance.plotPrices.call(1);
    assert.equal(5, web3.fromWei(plotPrice), "plot 1 now for 5 ether");
    var balancePre = await  web3.eth.getBalance(otherAddress);

    await instance.buyPlot(1, {from: otherAddress, value:web3.toWei(5, "ether")});
    var newOwner = await instance.plotOwners.call(1)
    assert.equal(newOwner, otherAddress, "other address now owns the plot");
   
    var balancePost = await  web3.eth.getBalance(otherAddress);
    assert.isOk((balancePre - balancePost) > web3.toWei(5, "ether") , "payment sent");

    await instance.draw(1, "canvas string",  {from: otherAddress});
    // await instance.draw(2, "canvas string",  {from: otherAddress});

});
})