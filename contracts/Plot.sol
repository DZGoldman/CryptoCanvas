pragma solidity ^0.4.16;

contract Plot {
    // Map plot index to owner  
    address[900] public plotOwners; 
    // index to is on sale (boolean)  
    bool[900] public plotIsForSale;   
    // index to price
    uint256[900] public plotPrices;   

    uint256 public feeRatio = 20;

    string public canvasString;

    address public admin;

    event Draw(uint256 index, string canvasString);
    event PlotStatusSet(uint256 index, bool newStatus);
    event PlotPriceSet(uint256 index, uint256 newPrice);
    event PlotBought(uint256 index, address newOwner);


     function Plot(
        address owner
    ) {
        address admin = owner;
    }

    // represent canvas?

    // todo: instantiate with origin address

    function getPlotOwners() public returns (address[900] owners) {
         return plotOwners;   
     }

    function senderOwnsPlot(uint256 index) returns (bool ownsPlot){
        //  check if sender exists?
         return msg.sender == plotOwners[index];
     }

    function setPlotStatus(uint256 index, bool newStatus) returns (bool newValue){
        require(senderOwnsPlot(index));
        require(newStatus != plotIsForSale[index]);
        plotIsForSale[index] = newStatus;
        PlotStatusSet(index, newStatus);
        return newStatus;
     }

    function setPlotPrice(uint256 index, uint256 newPrice) returns (uint256 price){
        require(senderOwnsPlot(index));
        require(plotPrices[index] != newPrice);
        plotPrices[index] = newPrice;
        PlotPriceSet(index, newPrice);
        return newPrice;
     }

    function setPriceAndMakeSellable(uint256 index, uint256 newPrice) returns (uint256 price){
        setPlotPrice(index, newPrice);
        setPlotStatus(index, true);
        return newPrice;
     }

     function buyPlot(uint256 index, uint256 funds) returns (uint256 plotIndex){
        require(!senderOwnsPlot(index));
        require(plotIsForSale[index]);
        uint256 price = plotPrices[index];
        uint256 fee = price / feeRatio;
        require(funds > price + fee);
        // require user has enough funds
        //  require(message.sender.balance >= totalPrice)
        address oldOwner = plotOwners[index];
        // check if unowned
        if (oldOwner == address(0)){
            // set admin as owner
            oldOwner = admin;
        } else {
            //  charge fee
            admin.transfer(fee);
        }
        oldOwner.transfer(price);
        //  update owndership
        plotOwners[index] = msg.sender;
        // set not for sale
        setPlotStatus(index, false);
        PlotBought(index, msg.sender);
        return plotIndex;
     }

     function draw (uint256 index, string canvasString) returns (string can){
        require(senderOwnsPlot(index));
        Draw(index, canvasString);
        return canvasString;
     }

    //  function index is right size?
     
    
}
