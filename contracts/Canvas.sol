pragma solidity ^0.4.16;

interface token {
    function transfer(address receiver, uint amount);
    function burnFrom(address _from, uint256 _value);
    function burn(uint256 _value);
}

contract Canvas {
    string public canvasString;
    token public tokenInstance;

    event Draw(string canvas);

    function Canvas(
        address addressOfToken
    ) {
        tokenInstance = token(addressOfToken);
    }
    function drawString(string data) public returns (bool success) {
        tokenInstance.burnFrom(msg.sender, 1);
        canvasString = data;
        Draw(data);
        return true;
      }
        function getCanvasString() public returns (string canv) {
         return canvasString;
         
     }

}
