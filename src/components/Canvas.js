import React, { PureComponent } from 'react'
// import $ from "jquery";
import autoBind from 'react-autobind';
import '../utils/Animate'

import Scroller from '../utils/Scroller'
import Tiling from '../utils/Tiling'

class Canvas extends PureComponent {
  constructor(props) {
    super(props)


    autoBind(this);
  }

  componentDidMount(){

	// Settings
	var contentWidth = 5000;
	var contentHeight = 5000;
	var cellWidth = 5;
	var cellHeight = 5;
	var pixelSize = cellWidth
	
	var content = document.getElementById('content');
	content.addEventListener("mousedown", handleMouseDown, false); 
	var context = content.getContext('2d');
	var tiling = new Tiling;
	
	function handleMouseDown(e) {
		var ctx = context
		var pixel = getPixelSelected(e)
		ctx.fillStyle = 'rgba(0,0,255,255)'
		console.log(pixel)
		// ctx.fillRect(pixel['x'], pixel['y'], pixelSize, pixelSize);
		newCellHash[`${pixel['x']},${pixel['y']}`] = 'rgba(0,0,255,255)'
	}

function getPixelSelected(e) {
	const values = scroller.getValues()
	const zoomLevel = values.zoom;
	const left = values.left
	const top = values.top
	console.log(zoomLevel)
	var canvas = content
        var rect = canvas.getBoundingClientRect(),
			pixel = new Array;
			console.log(rect)
        
        pixel['x'] = Math.floor( ((e.clientX + left- rect.left)/pixelSize )/ zoomLevel ) ;
              pixel['y'] = Math.floor( ((e.clientY + top - rect.top)/pixelSize )/zoomLevel ); 
        
        return pixel;
      
      }


	// Canvas renderer
	var render = function(left, top, zoom) {
		
		// Sync current dimensions with canvas
		content.width = clientWidth;
		content.height = clientHeight;
		
		// Full clearing
		context.clearRect(0, 0, clientWidth, clientHeight);

		// Use tiling
		tiling.setup(clientWidth, clientHeight, contentWidth, contentHeight, cellWidth, cellHeight);
		tiling.render(left, top, zoom, paint);
	};
	
	var newCellHash = {

	}
	// Cell Paint Logic
	var paint = function(col, row, left, top, width, height, zoom) {

        context.fillStyle = row%2 + col%2 > 0 ? "#ddd" : "red";
        		// context.fillStyle = Math.random() > 0.1 ? "#ddd" : "red";

		var c = newCellHash[`${row},${col}`]
		if (c ){
			context.fillStyle = newCellHash[`${row},${col}`]
		}
		context.fillRect(left, top, width, height);
		
		// context.fillStyle = "black";
		// context.font = (14 * zoom).toFixed(2) + 'px "Helvetica Neue", Helvetica, Arial, sans-serif';
		
		// Pretty primitive text positioning :)
		// context.fillText(row + "," + col, left + (6 * zoom), top + (18 * zoom));
		
	};
	




	// Intialize layout
var container = document.getElementById("container");
var content = document.getElementById("content");
var clientWidth = 0;
var clientHeight = 0;

// Initialize Scroller
var scroller = new Scroller(render, {
	zooming: true
});


var scrollLeftField = document.getElementById("scrollLeft");
var scrollTopField = document.getElementById("scrollTop");
var zoomLevelField = document.getElementById("zoomLevel");

setInterval(function() {
	var values = scroller.getValues();
	scrollLeftField.value = values.left.toFixed(2);
	scrollTopField.value = values.top.toFixed(2);
	zoomLevelField.value = values.zoom.toFixed(2);
}, 500);


var rect = container.getBoundingClientRect();
scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);


// Reflow handling
var reflow = function() {
	clientWidth = container.clientWidth;
	clientHeight = container.clientHeight;
	scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
};

window.addEventListener("resize", reflow, false);
reflow();

var checkboxes = document.querySelectorAll("#settings input[type=checkbox]");
for (var i=0, l=checkboxes.length; i<l; i++) {
	checkboxes[i].addEventListener("change", function() {
		scroller.options[this.id] = this.checked;
	}, false);
}

document.querySelector("#settings #zoom").addEventListener("click", function() {
	scroller.zoomTo(parseFloat(document.getElementById("zoomLevel").value));
}, false);

document.querySelector("#settings #zoomIn").addEventListener("click", function() {
	scroller.zoomBy(1.2, true);
}, false);

document.querySelector("#settings #zoomOut").addEventListener("click", function() {
	scroller.zoomBy(0.8, true);
}, false);

document.querySelector("#settings #scrollTo").addEventListener("click", function() {
	scroller.scrollTo(parseFloat(document.getElementById("scrollLeft").value), parseFloat(document.getElementById("scrollTop").value), true);
}, false);

document.querySelector("#settings #scrollByUp").addEventListener("click", function() {
	scroller.scrollBy(0, -150, true);
}, false);

document.querySelector("#settings #scrollByRight").addEventListener("click", function() {
	scroller.scrollBy(150, 0, true);
}, false);

document.querySelector("#settings #scrollByDown").addEventListener("click", function() {
	scroller.scrollBy(0, 150, true);
}, false);

document.querySelector("#settings #scrollByLeft").addEventListener("click", function() {
	scroller.scrollBy(-150, 0, true);
}, false);


if ('ontouchstart' in window) {

	container.addEventListener("touchstart", function(e) {
		// Don't react if initial down happens on a form element
		if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
			return;
		}

		scroller.doTouchStart(e.touches, e.timeStamp);
		e.preventDefault();
	}, false);

	document.addEventListener("touchmove", function(e) {
		scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
	}, false);

	document.addEventListener("touchend", function(e) {
		scroller.doTouchEnd(e.timeStamp);
	}, false);

	document.addEventListener("touchcancel", function(e) {
		scroller.doTouchEnd(e.timeStamp);
	}, false);

} else {

	var mousedown = false;

	container.addEventListener("mousedown", function(e) {
		if (e.target.tagName.match(/input|textarea|select/i)) {
			return;
		}
		
		scroller.doTouchStart([{
			pageX: e.pageX,
			pageY: e.pageY
		}], e.timeStamp);

		mousedown = true;
	}, false);

	document.addEventListener("mousemove", function(e) {
		if (!mousedown) {
			return;
		}
		
		scroller.doTouchMove([{
			pageX: e.pageX,
			pageY: e.pageY
		}], e.timeStamp);

		mousedown = true;
	}, false);

	document.addEventListener("mouseup", function(e) {
		if (!mousedown) {
			return;
		}
		
		scroller.doTouchEnd(e.timeStamp);

		mousedown = false;
	}, false);

	container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" :  "mousewheel", function(e) {
		scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
	}, false);

}

  }

  render() {
    return (
      <div>
     <div id="container">
     <canvas id="content"></canvas>
 </div>
 
 <div id="settings">
     <div><label for="scrollingX">ScrollingX: </label><input type="checkbox" id="scrollingX" checked/></div>
     <div><label for="scrollingY">ScrollingY: </label><input type="checkbox" id="scrollingY" checked/></div>
     <div><label for="animating">Animating: </label><input type="checkbox" id="animating" checked/></div>
     <div><label for="bouncing">Bouncing: </label><input type="checkbox" id="bouncing" checked/></div>
     <div><label for="locking">Locking: </label><input type="checkbox" id="locking" checked/></div>

     <div><label for="zooming">Zooming: </label><input type="checkbox" id="zooming" checked/></div>
     <div><label for="minZoom">Min Zoom: </label><input type="text" id="minZoom" size="5" value="0.5"/></div>
     <div><label for="maxZoom">Max Zoom: </label><input type="text" id="maxZoom" size="5" value="3"/></div>
     <div><label for="zoomLevel">Zoom Level: </label><input type="text" id="zoomLevel" size="5"/></div>
     <div><button id="zoom">Zoom to Level</button><button id="zoomIn">+</button><button id="zoomOut">-</button></div>
     
     <div><label for="scrollLeft">Scroll Left: </label><input type="text" id="scrollLeft" size="9"/></div>
     <div><label for="scrollTop">Scroll Top: </label><input type="text" id="scrollTop" size="9"/></div>
     <div><button id="scrollTo">Scroll to Coords</button></div>

     <div><button id="scrollByUp">&uarr;</button><button id="scrollByDown">&darr;</button><button id="scrollByLeft">&larr;</button><button id="scrollByRight">&rarr;</button></div>
 </div>
 
      </div>
    );
  }
}

export default Canvas
