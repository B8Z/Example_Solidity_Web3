// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0; 

//Open-Zeppelin contract imports 
import "./libs/BEP20.sol";
import "./libs/SafeMath.sol"; 
import "./Holy_Key.sol";
import "./Dao_Wallet.sol";


/// @title Voting with delegation.
contract DaoVoting {
    
    using SafeMath for uint256;
    
    Holy_Key key;
    // address public Dao_Wallet_Address = 0xDA0bab807633f07f013f94DD0E6A4F96F8742B53;

    Dao_Wallet d_wallet;
    
    uint256 public _iterator;
    address private dao_wallet; //set to address of the dao wallet
    IBEP20 VCS = BEP20(0xd9145CCE52D386f254917e481eB44e9943F39138); // VCS Deployed address
    
    // This declares a new complex type which will
    // be used for variables later.
    // It will represent a single voter.
    struct Voter {
        uint256 weight;
        bool voted;  // if true, that person already voted
        address delegate; // person delegated to
        uint256 vote;   // index of the voted proposal
    }

    // This is a type for a single proposal.
    struct Proposal {
        uint256 _proposal_id;
        uint8   _status; // will be pass/fail/ongoing
        uint256 _starting_block;
        address _sender;
        uint8   _function;
        address _wallet;
        address _transactionAddress;
        address _token;
        uint256 _amount;
        // uint256 _nft_reference; //should this be an address?
        string _rewards;
        string _name;   // short name (up to 32 bytes)
        uint256 voteCount; // number of accumulated votes
    }
    

    // This declares a state variable that
    // stores a `Voter` struct for each possible address.
    mapping(address => Voter) public voters;

    // A dynamically-sized array of `Proposal` structs.
    mapping(uint256 => Proposal) public proposals;

    //Create list to hold NFT owners
    address[] nft_list;
    
    constructor(Holy_Key _dm, address _dao_address) payable {
        key = _dm;
        _iterator = 1;
        dao_wallet = _dao_address;
    }
    
    function mintHolyKeys(uint256 _level)  public  {
        uint256 level = _level;
         key.mintHolyKeys(dao_wallet, level);
     }
    
    //Send a proposal by spending 100 VCS
    function sendProposal(uint8 funct, address tAddress, address tokenAddress, uint256 amount, string memory all_rewards, string memory name) payable public {
        

        //Web3 connected that has approve from allowance 
        // VCS.transferFrom(msg.sender, dao_wallet, 100);
        
        proposals[_iterator] = Proposal({ 
            _proposal_id: _iterator, //Keeps track of proposal through an incrementing ID value
            _status: 1,
            _starting_block: block.timestamp,
            _sender: msg.sender, //sender is the sender of the current message
            _function: funct, // need to create function
            _wallet: dao_wallet, //wallet is set to the DAO wallet's address
            _transactionAddress: tAddress, //transaction address is specified by user
            _token: tokenAddress, //token address is specified by user
            _amount: amount, //the amount is specified by the user
            // _nft_reference: nft_reference, //need to create function
            _rewards: all_rewards, //string containing each address for each reward corresponding to the tier
            _name: name, //name of the proposal
            voteCount: 0 //current number of votes on the proposal
        });
        
        _iterator = _iterator + 1;
    }
    
    
    // // Check `voter` right to vote on this ballot.
    function checkRightToVote(address _voter) public view returns (bool ableToVote) {
        
        bool canVote = false;
        for(uint i=0; i<key.keyCounter(); i++){
            if(_voter == key.ownerOf(i)){
                canVote = true;
            }
        }
        return canVote;
    }


    /// Delegate your vote to the voter `to`.
    function delegate(address to) public {
        // assigns reference
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted.");

        require(to != msg.sender, "Self-delegation is disallowed.");

        // Forward the delegation as long as
        // `to` also delegated.
        // In general, such loops are very dangerous,
        // because if they run too long, they might
        // need more gas than is available in a block.
        // In this case, the delegation will not be executed,
        // but in other situations, such loops might
        // cause a contract to get "stuck" completely.
        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;

            // We found a loop in the delegation, not allowed.
            require(to != msg.sender, "Found loop in delegation.");
        }

        // Since `sender` is a reference, this
        // modifies `voters[msg.sender].voted`
        sender.voted = true;
        sender.delegate = to;
        Voter storage delegate_ = voters[to];
        if (delegate_.voted) {
            // If the delegate already voted,
            // directly add to the number of votes
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            // If the delegate did not vote yet,
            // add to her weight.
            delegate_.weight += sender.weight;
        }
    }

    /// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    function vote(uint proposal) public {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = proposal;

        // If `proposal` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        proposals[proposal].voteCount += sender.weight;
    }
    
    //function that determines the status of the proposal
    //1 if the proposal is submitted
    //0 if the proposal does not have enough votes to pass and dies
    //2 if the proposal has made it to the checkpoint(reached enough votes so it doesn't die immediately)
    //3 if the proposal has passed
    //have 10 days to reach 10% of total votes, reaches checkmark, if not it fails
    //another 20 days to reach 50%, passes, if not it fails
    function updateStatus(uint256 proposal_id) public returns (uint8 status){
        if(proposals[proposal_id]._starting_block < block.timestamp + 10 days){
            return proposals[proposal_id]._status; //return if not old enough to reach checkmark
        }
        if(proposals[proposal_id].voteCount > nft_list.length.div(2) && proposals[proposal_id]._starting_block > block.timestamp + 20 days){ //hacky solution for not using an oracle
            proposals[proposal_id]._status = 3; //proposal vote passes
            //execute proposal from here
            return 3;
        }
        if(proposals[proposal_id].voteCount > nft_list.length.div(10)){
            proposals[proposal_id]._status = 2; //proposal vote reaches checkmark
            return 2;
        }
        if(proposals[proposal_id]._starting_block > block.timestamp + 20 days && proposals[proposal_id].voteCount < nft_list.length.div(2)){
            proposals[proposal_id]._status = 0; //proposal vote fails
            return 0;
        }
    }
    
    
    function getActiveProposals() public view returns (uint256[] memory all_active_proposals){
        //iterate through all of the active proposals and return an array of proposals that is all proposals that have status 1 or 2
        uint256 _another_iterator = 0;
        uint256[] memory active_proposals = new uint256[](_iterator);
        
        for(uint i=0; i<=_iterator; i++){ //Random 0 output at end of array
            if(proposals[i]._status == 1 || proposals[i]._status == 2){
                active_proposals[_another_iterator] = proposals[i]._proposal_id;
                _another_iterator = _another_iterator + 1;
            }
        }
        
        return active_proposals;
    }
    

    // Call the wallet contract to call this function
    //import wallet contract and create instance of to then call send function
    function send_funds_dao(address token_address, uint256 amount, address wallet_address) payable public {
        d_wallet.send(token_address, amount, wallet_address);
    }

    
    function buy_tokens(uint256 amountToBuy, address token_address) payable public{
        IBEP20 tokenToBuy = BEP20(token_address); 
        // uint256 tokenBalance = tokenToBuy.balanceOf(address(this));
        // require(amountToBuy > 0, "You need to send some ether");
        // require(amountToBuy <= tokenBalance, "Not enough tokens in the reserve");
        // require(
        //     tokenToBuy.allowance(msg.sender, address(this)) >= amountToBuy, "Token 1 allowance too low"
        //     );
        tokenToBuy.transferFrom(msg.sender, dao_wallet, amountToBuy);
    }

    
}