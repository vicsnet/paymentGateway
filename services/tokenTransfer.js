const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const tokenAbi = [
  "function transfer(address to, uint amount) public returns (bool)"
];
const token = new ethers.Contract(process.env.ERC20_CONTRACT_ADDRESS, tokenAbi, wallet);

async function sendMockTokens(to, amount) {
  const tx = await token.transfer(to, ethers.parseUnits(amount.toString(), 18));
  await tx.wait();
  return tx.hash;
}

module.exports = sendMockTokens;