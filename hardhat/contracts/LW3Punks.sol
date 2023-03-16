// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LW3Punks is Ownable, ERC721Enumerable {
    using Strings for uint256;

    uint256 public mintPrice = 0.001 ether;
    uint256 public maxTokenIds = 10;
    uint256 public tokenIds; // Total number of tokens minted

    bool public paused;
    string public baseTokenURI;

    modifier onlyWhenNotPaused() {
        require(!paused, "Contract currently paused");
        _;
    }

    constructor(string memory _baseTokenURI) ERC721("LW3Punks", "LW3P") {
        baseTokenURI = _baseTokenURI;
    }

    /**
     * @dev mint allows an user to mint 1 NFT per transaction.
     */
    function mint() public payable onlyWhenNotPaused {
        require(tokenIds < maxTokenIds, "Sold Out");
        require(msg.value >= mintPrice, "Not Enough Eth sent");
        tokenIds++;
        _safeMint(msg.sender, tokenIds);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
                : "";
    }

    function togglePause() external onlyOwner {
        paused = !paused;
    }

    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "Insufficient Funds");
        (bool sent, ) = payable(owner()).call{value: address(this).balance}("");
        require(sent, "Transaction Failed");
    }

    receive() external payable {}

    fallback() external payable {}
}
