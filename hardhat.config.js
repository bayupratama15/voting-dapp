require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    private : {
      url: "http://5.189.141.90:9655/",
      accounts : ["ee110824c3451b3471365383f4aa462f8e4266e7e306930845a24ebc8b7d0601"]
    }
  },
};
