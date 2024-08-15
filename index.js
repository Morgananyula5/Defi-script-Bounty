require('dotenv').config();
const { ethers } = require('ethers');
const { LendingPoolAddressesProvider, LendingPool } = require('@aave/protocol-v2');

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Uniswap and Aave Contract Addresses
const UNISWAP_ROUTER_ADDRESS = process.env.UNISWAP_ROUTER_ADDRESS;
const USDC_ADDRESS = process.env.USDC_ADDRESS;
const LINK_ADDRESS = process.env.LINK_ADDRESS;
const AAVE_LENDING_POOL_ADDRESS = process.env.AAVE_LENDING_POOL_ADDRESS;

// ABI Definitions (Replace with actual ABI JSON)
const ERC20_ABI = [ /* ERC20 ABI here */ ];
const SWAP_ROUTER_ABI = [ /* Uniswap V3 Swap Router ABI here */ ];
const AAVE_LENDING_POOL_ABI = [ /* Aave Lending Pool ABI here */ ];

// Create Contract Instances
const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);
const linkContract = new ethers.Contract(LINK_ADDRESS, ERC20_ABI, wallet);
const swapRouter = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, SWAP_ROUTER_ABI, wallet);
const lendingPool = new ethers.Contract(AAVE_LENDING_POOL_ADDRESS, AAVE_LENDING_POOL_ABI, wallet);

// Functions
async function approveToken(tokenContract, amount) {
  const decimals = await tokenContract.decimals();
  const amountInUnits = ethers.parseUnits(amount.toString(), decimals);
  const tx = await tokenContract.approve(swapRouter.address, amountInUnits);
  await tx.wait();
  console.log(`Approved ${amount} tokens`);
}

async function swapTokens(amountIn) {
  // Define Uniswap swap parameters
  const params = {
    tokenIn: USDC_ADDRESS,
    tokenOut: LINK_ADDRESS,
    fee: 3000,
    recipient: wallet.address,
    amountIn: ethers.parseUnits(amountIn.toString(), 6), // USDC usually has 6 decimals
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };
  const tx = await swapRouter.exactInputSingle(params);
  await tx.wait();
  console.log('Swap executed');
}

async function depositToAave(amount) {
  // Approve LINK for Aave
  await approveToken(linkContract, amount);
  
  // Deposit LINK into Aave
  const tx = await lendingPool.deposit(LINK_ADDRESS, ethers.parseUnits(amount.toString(), 18), wallet.address, 0);
  await tx.wait();
  console.log(`Deposited ${amount} LINK to Aave`);
}

async function main() {
  const amountToSwap = 100; // Amount of USDC to swap
  const amountToDeposit = 100; // Amount of LINK to deposit

  try {
    await approveToken(usdcContract, amountToSwap);
    await swapTokens(amountToSwap);
    await depositToAave(amountToDeposit);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
