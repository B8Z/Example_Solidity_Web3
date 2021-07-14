// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Holy_Key is ERC721, Ownable {

     // Stores all keyIDs and their respective level
     mapping(uint256 => uint256) public keys;
     mapping(uint256 => address) private addresses;
     uint256 public keyCounter;
     uint256 public level;
     constructor() ERC721("Holy_Key","HK"){
         keyCounter = 1;
     }

     // Function to mint NFTs, can only be called by the Owner which will be the DAO
     // Starts at keyID 1, and subsequent keys will have sequential keyIDs
     // Takes in a uint8 to signify the level of the NFT
     function mintHolyKeys(address _Dao_Wallet_Address, uint256 _level) public onlyOwner returns (uint256) {

         level = _level;
         uint256 keyID = keyCounter;

         // Stores keyID and respective level in a mapping 
         keys[keyID] = level;

         // Mints NFT with UID keyID
         _mint(_Dao_Wallet_Address, keyID);


         //Increases keyCounter to properly be able to ID the next NFT
         keyCounter = keyCounter + 1;
         return keyID;
     }
}