import React from "react";
import { useStep } from "../components/StepProvider";
import { Button } from "@chakra-ui/react";
function Confirm() {
  const { nextStep, prevStep, setStep, reset, activeStep } = useStep();
  return (
    <div>
      Confirm
      <Button size="sm" onClick={nextStep}>
        next
      </Button>
    </div>
  );
}

export default Confirm;
