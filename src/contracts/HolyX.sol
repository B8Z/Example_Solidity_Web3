// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

//Open-Zeppelin contract imports 
import "./libs/SafeBEP20.sol";
import "./libs/BEP20.sol";

// Native token for Governance of the DAO

// Constructor can only be called once to prevent ever minting more VCS tokens
contract HolyX is BEP20 {

    using SafeBEP20 for IBEP20;
    // Boolean to control minting
    bool public minted ;
    
    constructor() BEP20("HolyX", "VCS") {
        minted = false;
    }
    function mintTokens() public onlyOwner {
        require(!minted);
        mint(10000000);
    }

}