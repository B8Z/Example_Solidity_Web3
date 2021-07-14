import React, { Component } from 'react'
import logo from '../logo.png'


class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">
      <div className="card mb-4" >
      <div className="card-body">
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Dao Key Holdings</th>
              <th scope="col">VCS in circulation</th>
              <th scope="col">Current Dao Holdings</th>
              <th scope="col">Amount of Staked LP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{(this.props.daoKeyBalance)} Dao Keys</td>
              <td>{window.web3.utils.fromWei(this.props.vcsInCirculation, 'Ether')} VCS</td>
              <td>{window.web3.utils.fromWei(this.props.currentDaoHoldings, 'Ether')} VCS</td>
              <td>{window.web3.utils.fromWei(this.props.AmountOfStakedLP, 'Ether')} VCS</td>
            </tr>
          </tbody>
        </table>
        </div>
        </div>

        <div className="card mb-4" >
          <div className="card-body">
            <form className="mb-3" onSubmit={ async (event) => {
                event.preventDefault() 
                let amount
                amount = this._input_.value.toString()
                amount = window.web3.utils.toWei(amount, 'Ether')
                await this.props.VCSToken.methods.approve("0xb42abA23293EE2f218c54424f6CD75376A468281", amount).send({from: this.props.account}) //Pool contract address
                await this.props.LockedPoolContract.methods.stake(amount).send({from: this.props.account}) 
              }}>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(_input_) => { this._input_ = _input_ }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={logo} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; VCS
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Stake!</button>
            </form>
          </div>
        </div>

        <div className="card mb-4" >
          <div className="card-body">
            <form className="mb-3" onSubmit={ async (event) => {
                event.preventDefault()
                let amountproposal
                amountproposal = 10
                amountproposal = amountproposal.toString()
                amountproposal = window.web3.utils.toWei(amountproposal, 'Ether')
                await this.props.VCSToken.methods.approve("0xb3ce7135c0071BeAb59fcA32c39d9c205E0aaF09", amountproposal).send({from: this.props.account}) //DaoVoting contract address
                const voting_result = await this.props.DaoVoting.methods.sendProposal(this.str_input, this.int_input, this.int_array_input, this.array_input, this.boolean_array_input)
                window.alert(voting_result)
              }}>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(str_input) => { this.str_input = str_input }}
                  className="form-control form-control-lg"
                  placeholder="string_input"
                  required />
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(int_input) => { this.int_input = int_input }}
                  className="form-control form-control-lg"
                  placeholder="int_input"
                  required />
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(int_array_input) => { this.int_array_input = int_array_input }}
                  className="form-control form-control-lg"
                  placeholder="int_array_input"
                  required />
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(array_input) => { this.array_input = array_input }}
                  className="form-control form-control-lg"
                  placeholder="array_input"
                  required />
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(boolean_array_input) => { this.boolean_array_input = boolean_array_input }}
                  className="form-control form-control-lg"
                  placeholder="boolean_array_input"
                  required />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Propose!</button>
            </form>
          </div>
        </div>

        <div className="card mb-4" >
          <div className="card-body">
            <form className="mb-3" onSubmit={ async (event) => {
                event.preventDefault() 
                let _amount__
                _amount__ = this._input.value.toString()
                _amount__ = window.web3.utils.toBN(_amount__).toString()
                await this.props.DaoVoting.methods.vote(_amount__).send({from: this.props.account}) 
              }}>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(_input) => { this._input = _input }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Vote!</button>
            </form>
          </div>
        </div>

        <div className="card mb-4" >
          <div className="card-body">
            <form className="mb-3" onSubmit={ async (event) => {
                event.preventDefault() 
                let __amount
                let t_address
                __amount = this.input2.value.toString()
                __amount = window.web3.utils.toBN(__amount).toString()
                t_address = this.token_address.value.toString()
                const _balance = await this.props.DaoTrades.methods.tradeOTC(t_address, __amount).send({from: this.props.account}) 
                console.log(_balance)
              }}>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(token_address) => { this.token_address = token_address }}
                  className="form-control form-control-lg"
                  placeholder="address of token"
                  required />
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input2) => { this.input2 = input2 }}
                  className="form-control form-control-lg"
                  placeholder="amount"
                  required />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">OTC Trade!</button>
            </form>
          </div>
        </div>

        <div className="card mb-4" >
          <div className="card-body">
            <form className="mb-3" onSubmit={ async (event) => {
                event.preventDefault() 
                let amount__
                let trade_address
                amount__ = this.input__.value.toString()
                amount__ = window.web3.utils.toBN(amount__).toString()
                trade_address = this.trade_address.value.toString()
                const eligibility = await this.props.DaoTrades.methods.checkOTCEligibilityAndInformation(trade_address, amount__).call() 
                window.alert(eligibility)
             }}>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(trade_address) => { this.trade_address = trade_address }}
                  className="form-control form-control-lg"
                  placeholder="address of trade"
                  required />
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input__) => { this.input__ = input__ }}
                  className="form-control form-control-lg"
                  placeholder="amount"
                  required />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">OTC Trade Eligibility!</button>
            </form>
          </div>
        </div>

        <div className="card mb-4" >
          <div className="card-body">
          <form className="mb-3" onSubmit={ async (event) => {
                event.preventDefault() 
                // let rewards = await this.props.LockedPoolContract.getRewards().call()
                let rewards = await this.props.LockedPoolContract.getRewards().send({from: this.props.account})
                window.alert(rewards)
              }}>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Get Rewards!</button>
          </form>
          </div>
        </div>


      </div>
    );
  }
}

export default Main;
