const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DegenToken", function () {
  let DegenToken;
  let degenToken;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    DegenToken = await ethers.getContractFactory("DegenToken");
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy a new DegenToken contract for each test
    degenToken = await DegenToken.deploy();
    await degenToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await degenToken.owner()).to.equal(owner.address);
    });

    it("Should mint initial supply to the owner", async function () {
      const ownerBalance = await degenToken.balanceOf(owner.address);
      const initialSupply = ethers.parseUnits("1000000", 18);
      expect(await degenToken.totalSupply()).to.equal(initialSupply);
      expect(ownerBalance).to.equal(initialSupply);
    });
  });

  describe("Minting", function () {
    it("Should allow the owner to mint new tokens", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await degenToken.mint(addr1.address, amount);
      expect(await degenToken.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should not allow non-owners to mint tokens", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await expect(
        degenToken.connect(addr1).mint(addr2.address, amount)
      ).to.be.revertedWith("Only owner can mint");
    });
  });

  describe("Burning", function () {
    it("Should allow users to burn their tokens", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await degenToken.connect(owner).mint(addr1.address, amount);
      await degenToken.connect(addr1).burn(amount);
      expect(await degenToken.balanceOf(addr1.address)).to.equal(0);
    });
  });

  describe("Item Management", function () {
    it("Should allow the owner to set items", async function () {
      await degenToken.setItem("Sword", ethers.parseUnits("100", 18));
      expect(await degenToken.items("Sword")).to.equal(ethers.parseUnits("100", 18));
    });

    it("Should not allow non-owners to set items", async function () {
      await expect(
        degenToken.connect(addr1).setItem("Sword", ethers.parseUnits("100", 18))
      ).to.be.revertedWith("Only owner can mint");
    });
  });

  describe("Item Redemption", function () {
    beforeEach(async function () {
      await degenToken.setItem("Sword", ethers.parseUnits("100", 18));
      await degenToken.mint(addr1.address, ethers.parseUnits("200", 18));
    });

    it("Should allow users to redeem items if they have enough balance", async function () {
      await degenToken.connect(addr1).redeemItem("Sword");
      expect(await degenToken.balanceOf(addr1.address)).to.equal(ethers.parseUnits("100", 18));
      expect(await degenToken.getPlayerItems(addr1.address)).to.include("Sword");
    });

    it("Should not allow users to redeem items without sufficient balance", async function () {
      await degenToken.connect(addr1).burn(ethers.parseUnits("200", 18));
      await expect(
        degenToken.connect(addr1).redeemItem("Sword")
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Token Transfer", function () {
    it("Should allow users to transfer tokens", async function () {
      const amount = ethers.parseUnits("100", 18);
      await degenToken.mint(addr1.address, amount);
      await degenToken.connect(addr1).transferTokens(addr2.address, amount);
      expect(await degenToken.balanceOf(addr1.address)).to.equal(0);
      expect(await degenToken.balanceOf(addr2.address)).to.equal(amount);
    });

    it("Should emit a TokensTransferred event on successful transfer", async function () {
      const amount = ethers.parseUnits("100", 18);
      await degenToken.mint(addr1.address, amount);
      await expect(degenToken.connect(addr1).transferTokens(addr2.address, amount))
        .to.emit(degenToken, "TokensTransferred")
        .withArgs(addr1.address, addr2.address, amount);
    });
  });
});
