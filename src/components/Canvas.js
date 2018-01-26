import React, { PureComponent } from 'react'
// import $ from "jquery";
import autoBind from 'react-autobind';
import '../utils/Animate'

import Scroller from '../utils/Scroller'
import Tiling from '../utils/Tiling'
import * as enc from '../helpers/encript'
window.paintCount = 0
class Canvas extends PureComponent {
    constructor(props) {
    super(props)

        Object.assign(this,{
            contentWidth:  1000,
            cellWidth: 10,
            clientWidth: 0,
            newCellHash: {}
            })
        this.canvasWidth = this.contentWidth/this.cellWidth
         autoBind(this);
         this.state = {
             surfaceArea:{
                 area: 'n/a',
                 topLeft: 'n/a'
             }
         }
     }
    clear(e){
        this.newCellHash = {}
        this.reflow()
    }
    saveDrawing(options){
    
        const newNumStr = this.newCellsToNumStr();
        const {area, topLeft} = this.state.surfaceArea;
        const encryptedData = enc.leftRun(newNumStr)
        const fullEncryptedStr = '1c' + topLeft + 'c' + area + 'c' + encryptedData
        const {width, pixelSize} = this.state
        const {inkTokenInstance, currentUser} = this.props
        inkTokenInstance.drawString('0x' + fullEncryptedStr , {from: currentUser})
         .then( async (result) => {
      // Get the value from the contract to prove it worked.
             this.getDrawing()
         })
    }
    applyDrawing(fullEncryptedStr){
        const {canvasWidth, initialCanvas} = this
        const [encryptionType, topLeft, area, encryptedData] = fullEncryptedStr.split('c');
        const decryptedStr = enc.leftRunDecrypt(encryptedData)
        const newCanvas = [...initialCanvas];
        const areaWidth = Math.sqrt(area);

        const skipLength = canvasWidth - areaWidth;

        var currentCanvasIndex, newCellValue;
        for (var i = 0; i < +area; i ++){
            currentCanvasIndex = +topLeft + i + (skipLength * Math.floor(i/areaWidth));
            newCellValue = +decryptedStr[i];
            if (newCellValue != 9){
                newCanvas[currentCanvasIndex] = newCellValue
            }
        }
        this.initialCanvas = newCanvas
        return  newCanvas
    }
    putLatestOnCanvas(){
        this.getDrawing((fullEncryptedStr)=>{
            this.applyDrawing(fullEncryptedStr)
            this.reflow()
        })
    }
    getDrawing(next){
            const {inkTokenInstance, currentUser} = this.props
        
            inkTokenInstance.getCanvasString.call({from: currentUser}).then((result)=>{

              next && !next.target && next(result)
            })
        }
    newCellSurfaceArea (){
        const {newCellHash, canvasWidth} = this
        const coordinates = Object.keys(newCellHash).map((cString)=> cString.split(',').map((s)=>+s) )
        
        const xCoordinates = coordinates.map((c)=> c[0])
        const yCoordinates =  coordinates.map((c)=> c[1])
        if (!xCoordinates.length || !yCoordinates.length){
            return {
                    topLeft: 'n/a',
                    area: 'n/a'
                }
            }
        
        const xMin = Math.min(...xCoordinates)
        const xMax =  Math.max(...xCoordinates)
        const yMin = Math.min(...yCoordinates)
        const yMax =  Math.max(...yCoordinates)        
        const topLeft = yMin * canvasWidth + xMin;
        // const area = (1+ xMax - xMin) * (1 + yMax - yMin)
        const s = Math.max(( xMax - xMin), (yMax - yMin) ) + 1
        const area = s**2
        return {
            topLeft,
            area
        }
    }
    canvasIndexToCoordinates(index){
        const {canvasWidth} = this 
        const y = Math.floor(index/canvasWidth)
        const x = index % canvasWidth;
        return `${x},${y}`
    }
    canvasCoordinatesToIndex(x,y){
        return y* this.canvasWidth + x
    }
    newCellsToNumStr(){
        const {topLeft, area} = this.state.surfaceArea;
        const {canvasCoordinatesToIndex, canvasIndexToCoordinates, canvasWidth, initialCanvas,newCellHash} = this 
        // const startingC = canvasIndexToCoordinates(topLeft);
        const areaWidth = Math.sqrt(area);
        var currentIndex;
        const skipLength = canvasWidth - areaWidth;
        var newNumStr=''
        var newCellValue
        for(var i = 0; i < area; i++ ) {
            currentIndex = topLeft + i + (skipLength * Math.floor(i/areaWidth));
            newCellValue = newCellHash[canvasIndexToCoordinates(currentIndex)]
            newNumStr += typeof newCellValue =='number' ? newCellValue : '9'
        }
        return newNumStr


    }
    setSurfaceArea(surfaceArea){
        this.setState({surfaceArea})
    }

    handleMouseDown(e) {
        const {getPixelSelected, newCellHash, initialCanvas, canvasWidth} = this;
        const currentColor = this.props.currentColor
        const pixel =getPixelSelected(e);
        const coordinateStr = `${pixel['x']},${pixel['y']}`
        const colorInHash  = newCellHash[coordinateStr];
        const colorInInitialCanvas = initialCanvas[ pixel['x'] + (canvasWidth*pixel['y'])]

        if (colorInHash == currentColor ) {
            delete newCellHash[coordinateStr] 
            this.setSurfaceArea(this.newCellSurfaceArea())
        }
        else if (colorInInitialCanvas != currentColor || (colorInHash && colorInHash != currentColor)){
            newCellHash[coordinateStr] = currentColor
            this.setSurfaceArea(this.newCellSurfaceArea())
        }

    }

    getPixelSelected(e) {
        const { cellWidth, content, scroller} = this
        const {values, zoom, left, top} = scroller.getValues()

        const rect = content.getBoundingClientRect();
        const pixel = new Array;
            
        pixel['x'] = Math.floor( ((e.clientX + left- rect.left)/cellWidth )/ zoom ) ;
        pixel['y'] = Math.floor( ((e.clientY + top - rect.top)/cellWidth )/zoom ); 
        // console.log(this.getCurrentColor(pixel))
        return pixel;
    }
    // getCurrentColor(pixel){
    //     const { initialCanvas, contentWidth, cellWidth} = this
    //     const width = contentWidth / cellWidth
    //     console.log(pixel)
    //     const index =  pixel['y']*width + pixel['x']
    //     console.log(index)

    //     return initialCanvas[index ]
    // }
	// Cell Paint Logic
	paint(col, row, left, top, width, height, zoom) {
        // window.paintCount ++
        // if( window.paintCount % 10000 ==0){
        //     console.log( window.paintCount)
        // }
        const {context, newCellHash, canvasWidth, initialCanvas} = this


        // paint either a newly painted cell or from canvas state
		const newlyPaintedCell = enc.numToRbgaFull[newCellHash[`${row},${col}`]]
		if (newlyPaintedCell ){
			context.fillStyle = newlyPaintedCell
		} else {
            context.fillStyle = enc.numToRbgaFull[initialCanvas[col* canvasWidth + row]]
            // context.fillStyle = getRandomColor()
                    // context.fillStyle = row%2 + col%2 > 0 ? enc.numToRbgaFull[0] :  enc.numToRbgaFull[1];
        // context.fillStyle = Math.random() > 0.1 ? "#ddd" : "red";


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
    setInitialCanvas(){
        const {contentWidth, cellWidth} = this
        const width = contentWidth / cellWidth;
        
        this.initialCanvas = [...Array(width*width)].map((_, i)=>{ 
            // return Math.random() > 0.5 ? 0: 1
            return i % 2 
        })

    }

    componentDidMount(){
        var {contentWidth, cellWidth, newCellHash, content, container, paint} = this
        // Settings
        this.setInitialCanvas()


        var done = false
        window.setInterval(()=>{

            if (!done && this.props.inkTokenInstance){
                console.log('SETTING EVENT')
                done = true;
                const drawEvent = this.props.inkTokenInstance.allEvents(({}, {fromBlock: 0, toBlock: 'latest'}))
                console.log(drawEvent)
                drawEvent.watch((error, result)=>{
                    if (!error)
                        {
                            console.warn('SOMEBODY done drawn', result)
                        } else {
                            console.log(error);
                        }
                });
            }

        }, 500)
      
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
                if (!mousedown || !e.shiftKey) {
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

        // console.log(this.initialCanvas)
    }

  render() {
      console.log('rendering')
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
        <div>Surface Area: {this.state.surfaceArea.area}</div>
        <div>Top coordinate: {this.state.surfaceArea.topLeft}</div>
        <div onClick={this.clear}>clear</div>
        <div onClick={this.saveDrawing}>test1</div>
        <div onClick={this.getDrawing}>testget</div>
        <div onClick={this.putLatestOnCanvas}>test2</div>


 </div>
        <div>{this.newCellsToNumStr()}</div>
 
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