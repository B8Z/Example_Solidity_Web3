import React, { Component } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'
import VCS from '../abis/VCS.json'
// import Dao_Voting from '../abis/Dao_Voting.json'
import Dao_key from '../abis/Dao_key.json'
import Dao_voting from '../abis/Dao_voting.json'
import Wallet from '../abis/Wallet.json'
import VCS_USDT from '../abis/VCS_USDT_POOL.json'
import Dao_trades from '../abis/Dao_trades.json'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.web3.currentProvider) //MAKE SURE METAMASK HAS Binance Testnet
      await window.ethereum.enable()
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3 //generate web3 window

    const accounts = await web3.eth.getAccounts() //get accounts from metamask
    this.setState({ account: accounts[0] }) //set account var state to metamask account

    const VCSToken = new web3.eth.Contract(VCS, "0x2670495B8A5Bab944118991c9Ef15dEE323b6458") //VCS deployed contract address
    if(VCSToken){
      this.setState({ VCSToken })
      const _vcsInCirculation = await VCSToken.methods.totalSupply().call()
      this.setState({ vcsInCirculation: _vcsInCirculation.toString()})
    }
    else{
        window.alert('VCS contract not deployed to the right network')
    }

    const DaoKeyToken = new web3.eth.Contract(Dao_key, "0xEfD0cC8196f647410b9073D73D9cB155b4290800") //Dao Key deployed contract address
    if(DaoKeyToken){
      this.setState({ DaoKeyToken })
        let daoKeyBalance = await DaoKeyToken.methods.balanceOf(this.state.account).call()
        this.setState({ daoKeyBalance: daoKeyBalance.toString() })
    }
    else{
      window.alert('Dao_Key contract not deployed to the right network')
    }

    const DaoVoting = new web3.eth.Contract(Dao_voting, "0xb3ce7135c0071BeAb59fcA32c39d9c205E0aaF09") //Dao Voting deployed contract address
    if(DaoVoting){
      this.setState({ DaoVoting })
    }
    else{
      window.alert('DaoVoting contract not deployed to the right network')
    }

    const WalletContract = new web3.eth.Contract(Wallet, "0x48Ea6F316f54d37035f8515024EFe47D3A25DBDA") //Wallet deployed contract address
    if(WalletContract){
      this.setState({ WalletContract })
      let currentDaoHoldings = await WalletContract.methods.getBalance("0x2670495B8A5Bab944118991c9Ef15dEE323b6458").call() //VCS deployed contract address
      this.setState({ currentDaoHoldings: currentDaoHoldings.toString() })
    }
    else{
      window.alert('Wallet contract not deployed to the right network')
    }

    const LockedPoolContract = new web3.eth.Contract(VCS_USDT, "0xb42abA23293EE2f218c54424f6CD75376A468281") //Pool deployed contract address
    if(LockedPoolContract){
      this.setState({ LockedPoolContract })
      let AmountOfStakedLP = await LockedPoolContract.methods.totalSupply().call()
      this.setState({ AmountOfStakedLP: AmountOfStakedLP.toString() })
    }
    else{
      window.alert('Wallet contract not deployed to the right network')
    }
    
    const DaoTrades = new web3.eth.Contract(Dao_trades, "0x4E3544f6268B1344A91150614335A3EbCad09B3e") //Dao trades deployed contract address
    if(DaoTrades){
      this.setState({ DaoTrades })
    }
    else{
      window.alert('Wallet contract not deployed to the right network')
    }

    this.setState({ loading: false }) //finished execution, set loading to false
  }

  constructor(props) { //method of storing and displaying changing variables associated w/ blockchain data
    super(props)
    this.state = {
      account: '0x0', //stores the account address
      VCSToken: {}, //this.state.accountPlace "smartContractName: {}" to load contract
      DaoKeyToken: {}, //Place "smartContractName: {}" to load contract
      WalletContract: {},
      DaoTrades: {},
      DaoVoting: {},
      LockedPoolContract: {},
      daoKeyBalance: '0',
      vcsInCirculation: '0',
      currentDaoHoldings: '0',
      AmountOfStakedLP: '0', 
      loading: true //If loading or not, deals w/ connecting to metamask
    }
  }


  render() {
    let content
    if(this.state.loading) { //If didn't connect to correct metamask network
      content = <p id="loader" className="text-center">Loading... Please use the Binance Smart Chain Network on your metamask</p> 
    }
    else { //dynamically updating values go here ->
      content = <Main
      account={this.state.account}
      daoKeyBalance={this.state.daoKeyBalance}
      vcsInCirculation={this.state.vcsInCirculation}
      currentDaoHoldings={this.state.currentDaoHoldings}
      VCSToken={this.state.VCSToken}
      DaoKeyToken={this.state.DaoKeyToken}
      WalletContract={this.state.WalletContract}
      LockedPoolContract= {this.state.LockedPoolContract}
      AmountOfStakedLP={this.state.AmountOfStakedLP}
      DaoVoting={this.state.DaoVoting}
      DaoTrades={this.state.DaoTrades}
      />
    }

    return ( //Return Navbar to keep it accessible b/t pages & stay congruent w/ account
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1000px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://VC-DAO.crypto"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
