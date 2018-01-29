import React, { PureComponent } from 'react'
// import $ from "jquery";
import autoBind from 'react-autobind';
import * as enc from '../helpers/encript'
import Canvas from './Canvas'

class CanvasContainer extends PureComponent {
  constructor(props) {
    super(props)
    
    this.state = {
      currentColor: 1
    }

    this.height = this.state.width ;
    autoBind(this);
  }
//   test(){
//     // this.saveDrawing()
//     this.getDrawing((result)=>{
//       console.log(typeof result)
//       console.log('????', result.slice(2))
//       var x = enc.decryptMain(result.slice(2))
//       // x = enc.zoom(x, this.state.pixelSize)
//       this.applyDrawing(x)
//     })
//     // const d = this.context.getImageData(0,0,this.state.width, this.state.width).data
//     // console.log(d)
//     // var r = enc.clampedArrToNumArr(d)
//     // console.log(r)
//     // this.applyDrawing('222222222')
//     // this.context.scale(2, 2) 
//     // this.setState({
//     //   pixelSize: 2* this.state.pixelSize,
//     //   width: 2 * this.state.width
//     // })
//     // this.zoomIn()
//   }
//   test2(){
//         this.saveDrawing()

//   }

//   zoomIn(){
//     const {pixelSize, width} = this.state
//     const d = this.context.getImageData(0,0,this.state.width, this.state.width).data
//     const numArray = enc.clampedArrToNumArr(d)
//     var scale = 3
//     const zoomedStr = enc.zoom(numArray, 3)
//     this.setState({
//       pixelSize: 3  * pixelSize,
//       width: width * 3
//     })
//     setTimeout(()=>{this.applyDrawing(zoomedStr), 2000});

//   }
//   componentDidMount(){
//     this.context = this.canvas.getContext("2d");
//     this.setColor('rgba(0,0,255,255)')

//   }

//   saveDrawing(options){
    

//     const {width, pixelSize} = this.state
//     const {canvasInstance, currentUser} = this.props
//     var method

//     // switch (options.method) {
//     //   case 'string':
        
//     //     break;
    
//     //   default:
//     //     method = 
//     //     break;
//     // }
    
//      const d = this.context.getImageData(0,0,width, width).data
//     // console.log(d)
//     var r = enc.clampedArrToNumArr(d)
//     // r = enc.zoom(r, 1/pixelSize)
//     const encryptedData = enc.encryptMain(r)
//     canvasInstance.drawBytes('0x' + encryptedData , {from: currentUser})
//      .then( async (result) => {
//       // Get the value from the contract to prove it worked.
//       this.getDrawing()
//     })
//   }

//   getDrawing(next){
//     const {canvasInstance, currentUser} = this.props

//     canvasInstance.getCanvasBytes.call({from: currentUser}).then((result)=>{
//       console.log('?current canvas:', result)
//       next && next(result)
//     })
//   }

//  getPixelSelected(e) {
//   var rect = this.canvas.getBoundingClientRect(),
//       pixel = new Array;
  
//   pixel['x'] = Math.floor((e.clientX - rect.left)/this.state.pixelSize) * this.state.pixelSize;
// 	pixel['y'] = Math.floor((e.clientY - rect.top)/this.state.pixelSize) * this.state.pixelSize;
  
//   return pixel;

// }

//  getColor(e) {
//     return this.context.fillStyle

// //   context.fillStyle = 'document.defaultView.getComputedStyle(e.target,null)['backgroundColor']';
// }

setColor(currentColor){
  // console.log(color)
  this.setState({currentColor})
}

//   draw(e){
//     const pixel = this.getPixelSelected(e);
//     // this.getColor()
//     this.context.fillRect(pixel['x'], pixel['y'], this.state.pixelSize, this.state.pixelSize);

//     // for( var i = 0; i < 5000; i++){
//     //   this.context.fillRect(i, i, this.state.pixelSize, this.state.pixelSize);
//     // }
//   }

//   applyDrawing(numStr){
//     console.log('??', numStr)
//     // TODO: start at root coordinate, width is width of drawing instead of whole canvas
//     const width = Math.sqrt(numStr.length);
//     for (var i = 0; i < width; i++){
//       for (var j=0; j<width; j++){
//         const currentColorNum = numStr[i + (width * j)];
//         const currentColor = `rgba(${enc.numToRbga[currentColorNum] })`

//         if (this.getColor() != currentColor){
//           this.setColor(currentColor)
//         } 

//         this.context.fillRect(i, j, this.state.pixelSize, this.state.pixelSize);


//       }
//     }
//   }
  renderPallate(){
    return <div id='palatte-container'>
     {enc.numToRbgaFull.map((color, i)=>{
      return <div onClick={()=>{this.setColor(i)}}className='pallate-button' key={i} style={{backgroundColor: color}}>
        </div>
    })
  }
    </div>
    
  }



  render() {
    return (
      <div>
        {this.renderPallate()}
      <Canvas
        currentColor = {this.state.currentColor}
        canvasInstance={this.props.canvasInstance}
        currentUser ={this.props.currentUser}
      />
      <div onClick={this.test}>test</div>
      <div onClick={this.test2}>test2</div>
      <div>size{this.state.pixelSize}</div>
      </div>
    );
  }
}

export default CanvasContainer
