import React, { useState } from "react";
import { styles } from "./AddressInputsStyles";
import { Box, Stack, Input, FormControl } from "native-base";

type AddressInputsProps = {
  ownerAddress: string;
  currentAddress: string;
  handleChangeCurrentAddress: (currentAddress: string) => void;
};

const AddressInputs = ({
  ownerAddress,
  currentAddress,
  handleChangeCurrentAddress,
}: AddressInputsProps) => {
  return (
    <Stack direction="row" style={styles.addressInputContainer}>
      <Box>
        <FormControl.Label>Owner's address</FormControl.Label>
        <Input
          width={400}
          type="text"
          size="lg"
          value={ownerAddress}
          isDisabled
        />
      </Box>

      <Box>
        <Input
          width={400}
          size="lg"
          type="text"
          defaultValue=""
          value={currentAddress}
          onChangeText={handleChangeCurrentAddress}
          placeholder="Current address.."
        />
      </Box>
    </Stack>
  );
};

export default AddressInputs;
