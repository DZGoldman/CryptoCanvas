import React, { PureComponent } from 'react'
// import $ from "jquery";
import autoBind from 'react-autobind';
import * as enc from '../helpers/encript'

class Canvas extends PureComponent {
  constructor(props) {
    super(props)
    
    this.state = {
      test: ''
    }


    this.state.pixelSize = 1;
    this.state.width = 25;
    this.height = this.state.width ;
    autoBind(this);
  }
  test(){
    // this.saveDrawing()
    this.getDrawing()
    // this.context.scale(2, 2) 
    // this.setState({
    //   pixelSize: 2* this.state.pixelSize,
    //   width: 2 * this.state.width
    // })
  }
  test2(){
        this.saveDrawing()

  }
  componentDidMount(){
    this.context = this.canvas.getContext("2d");
    this.setColor('rgba(0,0,255,255)')

  }

  saveDrawing(options){
    

    const {width} = this.state
    const {inkTokenInstance, currentUser} = this.props
    var method

    // switch (options.method) {
    //   case 'string':
        
    //     break;
    
    //   default:
    //     method = 
    //     break;
    // }
    
     const d = this.context.getImageData(0,0,width, width).data
    // console.log(d)
    var r = enc.clampedArrToNumArr(d)
    console.log('done', r.length, enc.leftRun(r).length, enc.leftRun(enc.rotate(r)).length,  enc.leftRunWithLines(r).length)
     inkTokenInstance.drawBytes('0x' +  enc.leftRun(r), {from: currentUser})
     .then( async (result) => {
      // Get the value from the contract to prove it worked.
      this.getDrawing()
    })
  }

  getDrawing(){
    const {inkTokenInstance, currentUser} = this.props

    inkTokenInstance.getCanvasBytes.call({from: currentUser}).then((result)=>{
      console.log('?current canvas:', result)
    })
  }

 getPixelSelected(e) {
  var rect = this.canvas.getBoundingClientRect(),
      pixel = new Array;
  
  pixel['x'] = Math.floor((e.clientX - rect.left)/this.state.pixelSize) * this.state.pixelSize;
	pixel['y'] = Math.floor((e.clientY - rect.top)/this.state.pixelSize) * this.state.pixelSize;
  
  return pixel;

}

 getColor(e) {
    return this.context.fillStyle

//   context.fillStyle = 'document.defaultView.getComputedStyle(e.target,null)['backgroundColor']';
}

setColor(color){
  console.log(color)
  this.context.fillStyle = color
}

  draw(e){
    const pixel = this.getPixelSelected(e);
    this.getColor()
    this.context.fillRect(pixel['x'], pixel['y'], this.state.pixelSize, this.state.pixelSize);

    // for( var i = 0; i < 5000; i++){
    //   this.context.fillRect(i, i, this.state.pixelSize, this.state.pixelSize);
    // this.canvas.width = 500
    // }
  }

  renderPallate(){
    return <div id='palatte-container'>
     {enc.numToRbga.map((c, i)=>{
      const color = `rgba(${c})` 
      return <div onClick={()=>{this.setColor(color)}}className='pallate-button' key={i} style={{backgroundColor: color}}>
        </div>
    })
  }
    </div>
    
  }



  render() {
    return (
      <div>
        {this.renderPallate()}
      <canvas id='can' onClick={this.draw} ref={(canvas)=> this.canvas = canvas } width={this.state.width} height={this.state.width}>
      </canvas>
      <div onClick={this.test}>test</div>
      <div onClick={this.test2}>test2</div>
      </div>
    );
  }
}

export default Canvas
