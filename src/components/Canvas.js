import React, { PureComponent } from 'react'
// import $ from "jquery";
import autoBind from 'react-autobind';

class Canvas extends PureComponent {
  constructor(props) {
    super(props)
    
    this.state = {
      test: '',
      pixelSize: 10,
      width: 100,
    }

    this.height = this.state.width ;
    autoBind(this);
  }


  render() {
    return (
      <div>
        {this.renderPallate()}
      <canvas id='can' onClick={this.draw} ref={(canvas)=> this.canvas = canvas } width={this.state.width} height={this.state.width}>
      </canvas>
      <div onClick={this.test}>test</div>
      <div onClick={this.test2}>test2</div>
      <div>size{this.state.pixelSize}</div>
      </div>
    );
  }
}

export default Canvas
