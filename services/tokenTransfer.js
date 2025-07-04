const { ethers } = require('ethers');
const abi = require('./MockERC20ABI.json'); // Provide standard ERC20 ABI

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.ERC20_CONTRACT_ADDRESS, abi, wallet);

async function sendMockTokens(to, amount) {
  const decimals = await contract.decimals();
  const value = ethers.parseUnits(amount.toString(), decimals);
  const tx = await contract.transfer(to, value);
  await tx.wait();
  return tx.hash;
}

module.exports = sendMockTokens;
