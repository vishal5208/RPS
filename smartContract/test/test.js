const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {

  async function deployOneYearLockFixture() {


    // Contracts are deployed using the first signer/account by default
    const [j1, j2] = await ethers.getSigners();

    const RPS = await ethers.getContractFactory("RPS");
    const rps = await RPS.deploy();

    return { rps, j1, j2 };
  }

  describe("should simulate a Rock-Paper-Scissors game", function () {
    it("fun begins", async function () {
      const { rps, j1, j2 } = await loadFixture(deployOneYearLockFixture);


      const stake = ethers.parseEther("1");
      const c1Hash = await rps.hash("2", "0");

      // Create a game
      await expect(rps.createGame(c1Hash, j2.address, 500, { value: stake }))
        .to.emit(rps, 'NewGame')


      // const res = await rps.games(0);

      // console.log(res)

      // // Player 2 plays Rock
      // await rps.connect(j2).play("0", "3", { value: stake }).



      const initialTimestamp = (await ethers.provider.getBlock()).timestamp;

      await expect(rps.connect(j2).play("0", "3", { value: stake }))
        .to.emit(rps, 'Player2MoveCommitted')

      await ethers.provider.send("evm_setNextBlockTimestamp", [initialTimestamp + 3600]);
      await ethers.provider.send("evm_mine", []);



      await expect(rps.connect(j2).j1Timeout("0"))
        .to.emit(rps, 'GameResolved')



      // await expect(rps.connect(j1).solve("2", "0"))
      //   .to.emit(rps, 'GameResolved')
      // await rps.connect(j1).solve("1", c1Hash);


    });


  });


});
