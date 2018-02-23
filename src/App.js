import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import InkTokenContract from '../build/contracts/InkToken.json'
import CanvasContract from '../build/contracts/Canvas.json'
import Crowdsale from '../build/contracts/Crowdsale.json'

import getWeb3 from './utils/getWeb3'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import './css/ui.css'
import CanvasContainer from './components/CanvasContainer.js'
import Balances from './components/Balances.js'

import autoBind from 'react-autobind';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      inkToken: null
    }
    autoBind(this);

  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      console.log('web3', results.web3)
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      // this.instantiateContract()
      this.instantiateCanvas()
      this.instantiateCrowdSale()
      this.instantiateToken()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log(accounts)
      simpleStorage.deployed().then((instance) => {
        console.log('Deployed', instance)
        simpleStorageInstance = instance
        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        console.log('result1',result)
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call()
      }).then((result) => {
        console.log('result2',result)
        
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }

  instantiateCanvas(){
    const contract = require('truffle-contract')

    const canvas = contract(CanvasContract)
    canvas.setProvider(this.state.web3.currentProvider)

    this.state.web3.eth.getAccounts( async (error, accounts) => {
      const instance = await canvas.deployed()
      this.setState({canvasInstance: instance, currentUser: accounts[0]})
    })
  }
  instantiateCrowdSale(){
    const contract = require('truffle-contract')
    const crowdSale = contract(Crowdsale)
    crowdSale.setProvider(this.state.web3.currentProvider)

    this.state.web3.eth.getAccounts( async (error, accounts) => {
    crowdSale.setProvider(this.state.web3.currentProvider)
    const instance = await crowdSale.deployed()
      this.setState({crowdsaleInstance: instance, currentUser: accounts[0]})
    })
  }
  instantiateToken(){
    const contract = require('truffle-contract')
    const token = contract(InkTokenContract)
    token.setProvider(this.state.web3.currentProvider)
 
    this.state.web3.eth.getAccounts( async (error, accounts) => {
      token.setProvider(this.state.web3.currentProvider)
    const instance = await token.deployed()
      this.setState({tokenInstance: instance, currentUser: accounts[0]})
    })
  }

  render() {
    return (
      <div className="App">
      <div onClick={this.instantiateContract}>
        test contract
        </div>
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">

          <div className="pure-g">
            <div className="pure-u-1-1">
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The stored value is: {this.state.storageValue}</p>
            </div>
          </div>
          <Balances
            crowdsaleInstance={this.state.crowdsaleInstance}
            currentUser={this.state.currentUser}
            web3={this.state.web3}
            tokenInstance={this.state.tokenInstance}
          />
          <CanvasContainer
            canvasInstance={this.state.canvasInstance}
            currentUser={this.state.currentUser}
          />
        </main>
      </div>
    );
  }
}

export default App
