import React, { Component } from "react";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import ERC20TokenContract from "./contracts/ERC20Token.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { supplyValue: 0, balanceValue: 0, delegateValue:0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ERC20TokenContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ERC20TokenContract.abi,
        deployedNetwork && deployedNetwork.address,
      );


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance}, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { contract } = this.state;
    //await contract.methods.setName("Ronald").send({from: accounts[0]});

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    const supplyResponse = await contract.methods.totalSupply().call();

    // Update state with the result.
    this.setState({ supplyValue: supplyResponse});
  };

  getBalance = async () => {
    const {contract } = this.state;


    const inputValue = document.getElementById("balance").value;

    const balanceResponse = await contract.methods.balanceOf(inputValue).call();

    this.setState({balanceValue: balanceResponse});


  }

  tokenTransfer = async () => {
    const {accounts, contract} = this.state;

    const inputValue = document.getElementById("transfer").value;
    const transferValue = document.getElementById("transfer_amount").value;

    try {    
      await contract.methods.transfer(inputValue,transferValue).send({from: accounts[0]});
  } catch(e) {
    console.log(e);
  }
}

  delegateApproval = async () => {
    const { accounts, contract} = this.state;

    const address = document.getElementById("delegate").value;
    const numTokens = document.getElementById("delegate_amount").value;
    await contract.methods.approve(address,numTokens).send({from: accounts[0]});
  }

  delegateCheck = async () => {
    const {contract} = this.state;
    const owner = document.getElementById("owner").value;
    console.log(owner);
    const delegate = document.getElementById("delegateto").value;
    console.log(delegate);
    const delegateValue = await contract.methods.allowance(owner,delegate).call(); 
    this.setState({delegateValue: delegateValue});
  }

  delegateTransfer = async() => {
    const {accounts, contract} = this.state;
    
    const owner = document.getElementById("transferOwner").value;
    const buyer = document.getElementById("transferBuyer").value;
    const numTokens = document.getElementById("numTokens").value;
    await contract.methods.transferFrom(owner, buyer, numTokens).send({from: accounts[0]});

  }






  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>ERC20 Token</h2>
      
        <div>The stored name is: {this.state.supplyValue}</div>
        <input type="text" id="balance"></input>
        <button type="submit" onClick={this.getBalance}>Submit</button>
        <div> The stored balance of account is: {this.state.balanceValue}</div><br></br>
        <input type="text" id="transfer"></input>
        <input type="number" id="transfer_amount"></input>
        <button type="submit" onClick={this.tokenTransfer}>Transfer</button><br></br>
        <input type="text" id="delegate"></input>
        <input type="number" id="delegate_amount"></input>
        <button type="submit" onClick={this.delegateApproval}>Delegate</button><br></br>
        <input type="text" id="owner"></input>
        <input type="text" id="delegateto"></input>
        <button type="submit" onClick={this.delegateCheck}>Check Delegate</button><br></br>
        <div> The allocated amount to this delegate is: {this.state.delegateValue}</div><br></br>
        <input type="text" id="transferOwner"></input>
        <input type="text" id="transferBuyer"></input>
        <input type="number" id="numTokens"></input>
        <button type="submit" onClick={this.delegateTransfer}>Transfer to Buyer</button><br></br>
      </div>
    );
  }
}

export default App;
