require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    private : {
      url: "http://84.46.241.50:9655/",
      accounts : ["2ec4c1b1d7e0fb58ac08c8b8a342edc074032de2460a44cc33cd8810d59053a1"]
    }
  },
};
