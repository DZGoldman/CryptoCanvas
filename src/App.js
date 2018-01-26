import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import InkTokenContract from '../build/contracts/InkToken.json'
import CanvasContract from '../build/contracts/InkToken.json'


import getWeb3 from './utils/getWeb3'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import './css/ui.css'
import CanvasContainer from './components/CanvasContainer.js'
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
      this.instantiateInkToken()
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

  instantiateInkToken(){
    const contract = require('truffle-contract')
    const inkToken = contract(CanvasContract)
    inkToken.setProvider(this.state.web3.currentProvider)

    this.state.web3.eth.getAccounts( async (error, accounts) => {
      const instance = await inkToken.deployed()
      this.setState({inkTokenInstance: instance, currentUser: accounts[0]})
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
          <CanvasContainer
            inkTokenInstance={this.state.inkTokenInstance}
            currentUser={this.state.currentUser}
          />
        </main>
      </div>
    );
  }
}

export default App
