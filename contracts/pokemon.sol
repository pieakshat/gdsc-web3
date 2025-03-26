// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pokemon is ERC721URIStorage, Ownable {
    uint256 public constant MINT_PRICE = 0.001 ether;
    uint256 private _nextTokenId;
    mapping(address => bool) public hasMinted;

    // Mapping to store available Pokémon and their metadata URIs
    mapping(uint256 => string) private _pokemonURIs;

    // Define Pokémon IDs
    uint256 public constant CHARMANDER = 1;
    uint256 public constant BULBASAUR = 2;
    uint256 public constant SQUIRTLE = 3;

    constructor() ERC721("Pokemon NFT", "PKMN") Ownable(msg.sender){
        _pokemonURIs[CHARMANDER] = "ipfs://bafkreiay4qvdgrv6cyoz5hlaehsyrb2rxatja5vz2wnzhikzchqvm6brpe";
        _pokemonURIs[BULBASAUR] = "ipfs://bafkreifcsgvvbumh4prmczgmanxxbqgbknxss7nmkmb3ocwlkfwsh7bace";
        _pokemonURIs[SQUIRTLE] = "ipfs://bafkreifeku7vs5rpqafky7br6jotozwhlu3sgehe4vetn6uanlw27rn22m";
    }

    function mintPokemon(uint256 pokemonId) public payable {
        require(msg.value == MINT_PRICE, "Incorrect Ether amount");
        require(!hasMinted[msg.sender], "You have already minted a Pokemon");
        require(pokemonId >= 1 && pokemonId <= 3, "Invalid Pokemon selected");

        _nextTokenId++;
        _safeMint(msg.sender, _nextTokenId);
        _setTokenURI(_nextTokenId, _pokemonURIs[pokemonId]);

        hasMinted[msg.sender] = true;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
