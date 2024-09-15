// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DegenToken is ERC20 {
    address public owner;

    mapping(string => uint256) public items;

    mapping(address => string[]) public playerItems;

    event ItemRedeemed(address indexed player, string itemName);

    event TokensTransferred(address indexed from, address indexed to, uint256 amount);

    constructor() ERC20("Degen", "DGN") {
        owner = msg.sender;
        uint256 initialSupply = 1000000 * 10**decimals();
        _mint(msg.sender, initialSupply);
    }
  
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can mint");
        _;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }


    function setItem(string memory itemName, uint256 cost) public onlyOwner {
        items[itemName] = cost; 
    }

    function redeemItem(string memory itemName) public {
        require(items[itemName] > 0, "Item not available for redemption");
        require(balanceOf(msg.sender) >= items[itemName], "Insufficient balance");

        transfer(owner, items[itemName]);

        playerItems[msg.sender].push(itemName);
        emit ItemRedeemed(msg.sender, itemName);
    }

    function getPlayerItems(address player) public view returns (string[] memory) {
        return playerItems[player];
    }

    function transferTokens(address to, uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        transfer(to, amount);

        emit TokensTransferred(msg.sender, to, amount);
    }
}