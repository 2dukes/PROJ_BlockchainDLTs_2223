// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Contract responsible for Minting NFTs.
/// @notice Used as an reward for campaign contributors.
contract CrowdNFT is ERC721URIStorage {
    using Counters for Counters.Counter;

    /// @notice The counter of how many NFTs were minted.
    Counters.Counter public tokenIds;

    /// @notice Instantiate CrowdNFT token.
    constructor() ERC721("CrowdNFT", "NFT") {}

    /** @notice Mint an NFT.
        @param recipient The address of the NFT destination.
        @param tokenURI The metadata associated to the NFT.
        @return newItemID The ID of the newly minted NFT.
     */
    function mintNFT(address recipient, string memory tokenURI)
        public
        returns (uint256)
    {
        tokenIds.increment();

        uint256 newItemId = tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
