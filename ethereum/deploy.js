require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const mnemonicPhrase = process.env.ACCOUNT_MNEMONIC;
const network = process.env.RINKEBY_ENDPOINT;
const compiledFactory = require("../frontend/src/ethereum/build/ElectionFactory.json");

const provider = new HDWalletProvider(
  mnemonicPhrase,
  // remember to change this to your own phrase!
  network
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);
// const deploy = async () => {
//   const accounts = await web3.eth.getAccounts();

//   console.log("Attempting to deploy from account", accounts[0]);
//   //contract deployment
//   const result = await new web3.eth.Contract(compiledFactory.abi)
//     .deploy({ data: compiledFactory.evm.bytecode.object })
//     .send({ from: accounts[0] })
//     .catch((e) => {
//       console.log("Error occured while deploying contract: ", e);
//     });

//   console.log("Contract deployed to", result.options.address);

//   provider.engine.stop();
// };

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const deployingAddress = accounts[0];

  console.log("Attempting to deploy from account", deployingAddress);

  // Print current balance of deploying address
  const balance = await web3.eth.getBalance(deployingAddress);
  console.log(
    `Current balance of deploying address: ${web3.utils.fromWei(
      balance,
      "ether"
    )} ether`
  );

  // Contract deployment
  const gasPrice = await web3.eth.getGasPrice();
  const gasEstimate = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .estimateGas();
  const value = "0";
  const cost = gasPrice * gasEstimate + value;
  console.log(
    `Estimated cost to deploy contract: ${web3.utils.fromWei(
      cost.toString(),
      "ether"
    )} ether`
  );

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({
      from: deployingAddress,
      gas: gasEstimate,
      gasPrice: gasPrice,
      value: value,
    })
    .catch((e) => {
      console.log("Error occurred while deploying contract: ", e);
    });

  console.log("Contract deployed to", result.options.address);

  provider.engine.stop();
};

deploy();
