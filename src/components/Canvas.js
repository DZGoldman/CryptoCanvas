import React, { PureComponent } from 'react'
// import $ from "jquery";
import autoBind from 'react-autobind';
import '../utils/Animate'

import Scroller from '../utils/Scroller'
import Tiling from '../utils/Tiling'
import * as enc from '../helpers/encript'

class Canvas extends PureComponent {
    constructor(props) {
    super(props)

        Object.assign(this,{
            contentWidth:  100,
            cellWidth: 10,
            clientWidth: 0,
            newCellHash: {}
            })
         autoBind(this);
     }

    handleMouseDown(e) {
        const {getPixelSelected, newCellHash} = this
        const pixel =getPixelSelected(e)
        newCellHash[`${pixel['x']},${pixel['y']}`] = this.props.currentColor
    }

    getPixelSelected(e) {
        const { cellWidth, content, scroller} = this
        const {values, zoom, left, top} = scroller.getValues()

        const rect = content.getBoundingClientRect();
        const pixel = new Array;
            
        pixel['x'] = Math.floor( ((e.clientX + left- rect.left)/cellWidth )/ zoom ) ;
        pixel['y'] = Math.floor( ((e.clientY + top - rect.top)/cellWidth )/zoom ); 
        console.log(this.getCurrentColor(pixel))
        return pixel;
    }
    getCurrentColor(pixel){
        const { initialCanvas, contentWidth, cellWidth} = this
        const width = contentWidth / cellWidth
        console.log(pixel)
        const index =  pixel['y']*width + pixel['x']
        console.log(index)

        return initialCanvas[index ]
    }
	// Cell Paint Logic
	paint(col, row, left, top, width, height, zoom) {
        

        const {context, newCellHash} = this
        context.fillStyle = row%2 + col%2 > 0 ? enc.numToRbgaFull[0] :  enc.numToRbgaFull[1];
        // context.fillStyle = Math.random() > 0.1 ? "#ddd" : "red";
                // context.fillStyle = getRandomColor()


		const newlyPaintedCell = newCellHash[`${row},${col}`]
		if (newlyPaintedCell ){
			context.fillStyle = newlyPaintedCell
		}
		context.fillRect(left, top, width, height);
    };
    
    renderTiles (left, top, zoom) {
        var {contentWidth, cellWidth, content, clientWidth, context, paint, tiling} = this
        if (!clientWidth){
            clientWidth = 0
        }
		// Sync current dimensions with canvas
		content.width = clientWidth;
        content.height = clientWidth;
        		
		// Full clearing
		context.clearRect(0, 0, clientWidth, clientWidth);

		// Use tiling
		tiling.setup(clientWidth, clientWidth, contentWidth, contentWidth, cellWidth, cellWidth);
		tiling.render(left, top, zoom, paint);
	};
	
    reflow() {
        const {container, contentWidth, scroller} = this
        this.clientWidth = container.clientWidth;
        scroller.setDimensions(this.clientWidth, this.clientWidth, contentWidth, contentWidth);
    };

    componentDidMount(){
        var {contentWidth, cellWidth, newCellHash, content, container, paint} = this
        // Settings
        
        content.addEventListener("mousedown", this.handleMouseDown, false); 
        var context = content.getContext('2d');
        this.context = context
        var tiling = new Tiling;
        this.tiling = tiling
    
    
        // Initialize Scroller
        var scroller = new Scroller(this.renderTiles, {
            zooming: true
        });
        this.scroller = scroller

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



        window.addEventListener("resize", this.reflow, false);
        this.reflow();

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

        this.initialCanvas = this.context.getImageData(0,0,this.contentWidth, this.contentWidth).data
        this.initialCanvas = enc.clampedArrToNumArr(this.initialCanvas)
        // this.initialCanvas = enc.zoom(this.initialCanvas, 1/this.cellWidth)
        console.log('sadfdasfdasf',this.initialCanvas.length)
        // console.log(this.initialCanvas)
    }

  render() {
    return (
      <div>
     <div ref={(container)=> this.container = container} id="container">
     <canvas ref={(content)=> this.content = content} id="content"></canvas>
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

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }