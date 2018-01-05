var InkToken = artifacts.require("./InkToken.sol");

contract('InkToken', function(accounts) {

  it("...should store the value 89.",async  function() {
    const instance = await InkToken.deployed()
    const by = await instance.getCanvasBytes.call()
    console.log('???????',by)

  });

});
