import { Alert } from "react-native";
import { contractAbi, ownerContractAddress } from "../utils/global-constants";
import Web3 from "web3";

const web3 = new Web3(window.ethereum);
const lotteryContract = new web3.eth.Contract(
  contractAbi,
  ownerContractAddress
);

export const changeOwner = async (
  newOwnerAddress: string,
  currentOwnerAddress: string
) => {
  try {
    // Estimate gas limit
    const gasEstimate = await lotteryContract.methods
      .changeOwner(newOwnerAddress)
      .estimateGas({ from: currentOwnerAddress });

    // Call the changeOwner function from the contract
    await lotteryContract.methods
      .changeOwner(newOwnerAddress)
      .call({ from: currentOwnerAddress, gas: gasEstimate.toString() });

    // Log the transaction receipt
    Alert.alert("Transaction successful");
  } catch (error: any) {
    Alert.alert("Error changing owner");
    console.error("Error changing owner", error);
    throw error;
  }
};
