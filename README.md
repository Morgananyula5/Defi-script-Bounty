# DeFi Script Overview

## Overview of the Script

This DeFi script is designed to demonstrate the integration of multiple DeFi protocols to enhance financial operations. The script performs a token swap using Uniswap V3 and subsequently interacts with Aave to deposit the swapped tokens and start earning interest. 

### Workflow

1. **Approve USDC on Uniswap**:
   - The script begins by approving the Uniswap V3 Swap Router to spend USDC on behalf of the user. This step is essential to enable the token swap transaction.

2. **Retrieve Pool Information from Uniswap**:
   - It retrieves necessary pool information for the USDC-LINK pair from the Uniswap V3 Factory contract. This includes details about the liquidity pool where the swap will occur.

3. **Execute Token Swap on Uniswap**:
   - The script then executes the swap, converting USDC into LINK tokens using the Uniswap V3 Swap Router.

4. **Approve LINK on Aave**:
   - Following the swap, the LINK tokens are approved for use by Aave, enabling their deposit into the Aave protocol.

5. **Deposit LINK into Aave**:
   - The final step involves depositing the LINK tokens into Aave to earn interest, demonstrating how to leverage multiple DeFi protocols for enhanced financial gains.

## Diagram Illustration

Below is a diagram illustrating the sequence of steps and interactions between the DeFi protocols involved in this script.

![DeFi Workflow Diagram](Defi.jpg)

## Code Explanation

### 1. **Approve Token Function**

```javascript
async function approveToken(tokenAddress, tokenABI, amount, wallet) {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);
    const approveAmount = ethers.parseUnits(amount.toString(), USDC.decimals);
    const approveTransaction = await tokenContract.approve.populateTransaction(
      SWAP_ROUTER_CONTRACT_ADDRESS,
      approveAmount
    );
    const transactionResponse = await wallet.sendTransaction(
      approveTransaction
    );
    console.log(`-------------------------------`);
    console.log(`Sending Approval Transaction...`);
    console.log(`-------------------------------`);
    console.log(`Transaction Sent: ${transactionResponse.hash}`);
    console.log(`-------------------------------`);
    const receipt = await transactionResponse.wait();
    console.log(
      `Approval Transaction Confirmed! https://sepolia.etherscan.io/tx/${receipt.hash}`
    );
  } catch (error) {
    console.error("An error occurred during token approval:", error);
    throw new Error("Token approval failed");
  }
}
