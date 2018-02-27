import React, { Component } from 'react'
import autoBind from 'react-autobind';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
        eth: 0,
        ink: 0
    }
    autoBind(this);

  }

  componentWillMount() {
// lazy solution: TODO: listener for changes? meh...
    window.setInterval(()=>{
      this.updateBalances()
    }, 5000)
  }
  buyInkTokens(){
    const valueInEth = this.numInput.value
    this.props.crowdsaleInstance.sendTransaction({from: this.props.currentUser, value: window.web3.toWei(valueInEth, "ether")}).then(()=>{
        this.updateBalances()
    })
    
  }
  getEthBalance(next){
      const {web3, currentUser} = this.props
        const ethBalance =  web3.eth.getBalance(currentUser,  (error, result)=>{
            if(!error){
                const ethResult = window.web3.fromWei(result.valueOf(), "ether")
                next(ethResult)
            }
        })
  }
  getInkBalance(next){
    const {web3, currentUser, tokenInstance} = this.props
      const ethBalance =  tokenInstance.getBalance.call(currentUser).then((result)=>{
          next(result.valueOf())
      })
      
  }
  updateBalances(){
    this.getEthBalance((ethBalance)=>{
      this.getInkBalance((inkBalance)=>{
        const res = {}
        if (inkBalance){
          res.ink = inkBalance
        }
        if (ethBalance){
          res.eth = ethBalance
        }
        if (res.eth != this.state.eth || res.ink != this.state.ink){

          this.setState(res)
        }
      })
    })
  }


  render() {
    return (
      <div>
          <input
            type='number'
            ref={(numInput)=>{this.numInput=numInput}}
          />
          <div>Eth: {this.state.eth} Ink: {this.state.ink} </div>
          <div > <span onClick={this.buyInkTokens}>buy ink</span> <span onClick={this.updateBalances}>update</span></div>
          <br/>
      </div>
    );
  }
}

export default App
