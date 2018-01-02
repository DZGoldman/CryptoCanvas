import React, { PureComponent } from 'react'
import $ from "jquery";


class Canvas extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  componentDidMount(){
    var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    pixelSize = 5,
    colors = 10;

// Add drawing listener //
canvas.addEventListener("click", draw, false);

// Add color change listener //
// var colorCount = 0;
// while (colorCount < colors) {
//   colorCount++;
//   var colorBlock = document.getElementsByClassName('color' + colorCount);
//   colorBlock[0].addEventListener("click", selectColor, false);
// }

function draw(e) {
  var pixel = getPixelSelected(e);
  context.fillRect(pixel['x'], pixel['y'], pixelSize, pixelSize);
//   console.log(context.getImageData(0,0,5000,5000))
  for( var i = 0; i < 5000; i++){
    context.fillRect(i, i, pixelSize, pixelSize);
  }
}

function getPixelSelected(e) {
  var rect = canvas.getBoundingClientRect(),
      pixel = new Array;
  
  pixel['x'] = Math.floor((e.clientX - rect.left)/pixelSize) * pixelSize;
	pixel['y'] = Math.floor((e.clientY - rect.top)/pixelSize) * pixelSize;
  
  return pixel;

}

function selectColor(e) {
    context.fillStyle = 'red';

//   context.fillStyle = 'document.defaultView.getComputedStyle(e.target,null)['backgroundColor']';
}


  }


  render() {
    return (
        <canvas id="canvas" width="5000" height="5000">
    </canvas>
    );
  }
}

export default Canvas
