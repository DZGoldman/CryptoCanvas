pragma solidity ^0.4.16;

interface token {
    function transfer(address receiver, uint amount);
    function burnFrom(address _from, uint256 _value);
}

contract Canvas {
    string canvasString;
    token public tokenInstance;

    event Draw(string canvas);

    function Canvas(
        address addressOfToken
    ) {
        tokenInstance = token(addressOfToken);
    }


    function drawString(string data) public returns (bool success) {
        Draw(data);
         canvasString = data;
         return true;
      }
        function getCanvasString() public returns (string canv) {
         return canvasString;
         
     }

}
