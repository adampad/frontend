import React, { useEffect, useState } from "react";
import { NativeBaseProvider, Stack, Container } from "native-base";
import { Alert, View } from "react-native";
import { styles } from "./AppStyles";
import { ActionButtons, AddressInputs, Cards, Header } from "./components";
import { isInputValidAddress } from "./utils/helpers";
import Web3 from "web3";
import {
  contractAbi,
  ownerContractAddress,
  PROPOSED_CARDS_OPTIONS,
  TOTAL_VOTES,
} from "./utils/global-constants";
import { Voter } from "./utils/global-types";

const App = () => {
  const web3 = new Web3(window.ethereum);
  const lotteryContract = new web3.eth.Contract(
    contractAbi,
    ownerContractAddress
  );

  const [ownerAddress, setOwnerAddress] = useState(
    lotteryContract.options.address ?? ""
  );
  const [currentAddress, setCurrentAddress] = useState("");
  const [isVotingFinished, setIsVotingFinished] = useState(() => false);
  const [voters, setVoters] = useState<Voter[]>([]);
  const currentUserVoteCount =
    voters.find((item) => item.address === currentAddress)?.voteCount || 0;

  // console.log("lotteryContract = ", lotteryContract);
  // console.log("ownerAddress = ", ownerAddress);

  // useEffect(() => {
  //   // add new voter into the array when the current address changes and is valid address
  //   if (isInputValidAddress(currentAddress))
  //     setVoters((prev) => [...prev, { address: currentAddress, voteCount: 0 }]);
  // }, [currentAddress]);

  const handleChangeCurrentAddress = (currentAddress: string) =>
    setCurrentAddress(currentAddress);

  const handleWithDraw = () => lotteryContract.methods.withdraw().call();

  const handleReset = () => {
    setIsVotingFinished(true);
    lotteryContract.methods.reset().call();
  };

  const handleDeclareWinner = () => {
    setIsVotingFinished(true);
    lotteryContract.methods.revealWinners();
  };

  const hadleDestroy = () => {
    setIsVotingFinished(true);
    lotteryContract.methods.destroy();
  };

  const handleUserVote = (proposalId: number) => {
    lotteryContract.methods.vote(proposalId);
    // find the user in the array and add the vote in the total vote count
    setVoters((prev) =>
      prev.map((user) =>
        user.address === currentAddress
          ? { ...user, voteCount: user.voteCount + 1 }
          : user
      )
    );
  };

  const handleChangeOwnersAddress = (inputOwner: string) => {
    setOwnerAddress(inputOwner);
  };

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Header
          totalBalance={0}
          remainingVotes={TOTAL_VOTES - currentUserVoteCount}
        />

        {/* Here the images */}
        <Container>
          <Stack direction="row" mb="10" mt="1.5" space={10}>
            <Cards
              proposedCards={PROPOSED_CARDS_OPTIONS}
              totalVoterCount={currentUserVoteCount}
              isVotingFinished={isVotingFinished}
              isOwnerAddress={
                currentAddress === lotteryContract.options.address
              }
              isValidVoterAddress={isInputValidAddress(currentAddress)}
              handleUserVote={handleUserVote}
            />
          </Stack>

          {/* Here the input addresses */}
          <AddressInputs
            ownerAddress={ownerAddress}
            currentAddress={currentAddress}
            handleChangeCurrentAddress={handleChangeCurrentAddress}
          />

          {/* Lastly the buttons and history*/}
          <ActionButtons
            ownerAddress={currentAddress}
            isSmartContractOwner={currentAddress === ownerAddress}
            handleChangeOwnersAddress={handleChangeOwnersAddress}
            handleWithDraw={handleWithDraw}
            handleReset={handleReset}
            handleDeclareWinner={handleDeclareWinner}
            hadleDestroy={hadleDestroy}
          />
        </Container>
      </View>
    </NativeBaseProvider>
  );
};

export default App;
