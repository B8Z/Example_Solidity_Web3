// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
//Open-Zeppelin contract imports 
import "./libs/BEP20.sol";

//Contract for the DAO Wallet
contract Dao_Wallet is Ownable, IERC721Receiver {
    
    string public contract_name;
    
    constructor(string memory name) {
        // Reverts if contract has been run already
        contract_name = name;
    }
    
    //Return token balance of a specified address
    function getBalance(address token_address) public view returns (uint256 token_balance){
        IBEP20 token = BEP20(token_address);
        token_balance = token.balanceOf(address(this));
        return token_balance;
    }
    
    //Send funds to a specified address
    function send(address token_address, uint256 amount, address wallet_address) public {
        IBEP20 token = BEP20(token_address);
        token.transfer(wallet_address, amount);
    }
    
    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}