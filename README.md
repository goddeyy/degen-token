## DegenToken Smart Contract

Loom Video Continuation for Hardhat test

https://www.loom.com/share/5e8de8384094463daa76887619dddae7?sid=129c3ac0-fc97-42db-b940-8b3e1f796a03

### Overview
The DegenToken smart contract is an ERC20 token with additional features for managing items and their redemption. It allows the owner to mint new tokens, set costs for items, and facilitates token transfers and item redemptions. This contract is built using Solidity and OpenZeppelin’s ERC20 implementation.

### Features
- ERC20 Compliance: Standard ERC20 token with minting and burning functionalities.

**Item Management:**
- Set costs for items.
- Redeem items by transferring tokens to the owner.
- Token Transfers: Transfer tokens between accounts and emit events for transfers.

### Contract Details
- Constructor

Deploys the contract with an initial supply of 1,000,000 tokens to the deployer's address.

- State Variables

address public owner - Address of the contract owner.

mapping(string => uint256) public itemCosts - Mapping of item names to their costs.

mapping(address => string[]) public playerItems - Mapping of addresses to their redeemed items.

- Modifiers
onlyOwner - Restricts access to functions that can only be executed by the contract owner.

- Functions

mint(address to, uint256 amount): Allows the owner to mint new tokens to a specified address.

burn(uint256 amount): Allows users to burn their own tokens.

setItemCost(string memory itemName, uint256 cost): Allows the owner to set the cost for an item.

redeemItem(string memory itemName): Allows users to redeem an item if they have sufficient balance and the item is available.

getPlayerItems(address player): Returns the list of items redeemed by a specified player.

transferTokens(address to, uint256 amount): Allows users to transfer tokens to another address.

- Events

ItemRedeemed(address indexed player, string itemName): Emitted when a user redeems an item.

TokensTransferred(address indexed from, address indexed to, uint256 amount): Emitted when tokens are transferred between addresses.


## License

This contract is released under the MIT License.