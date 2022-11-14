import { Button, Flex } from "@chakra-ui/react";
import { Step, Steps } from "chakra-ui-steps";
import Upload from "../components/Upload";
import Confirm from "../components/Confirm";
import Maker from "../components/Maker";
import Download from "../components/Download";
import  { useStep } from "../components/StepProvider";
function ProgressBar() {
  const { nextStep, prevStep, setStep, reset, activeStep } = useStep();

  const steps = [
    { label: "Step 1", content: Upload },
    { label: "Step 2", content: Confirm },
    { label: "Step 3", content: Maker },
    { label: "Step 4", content: Download },
  ];

  return (
    <Flex flexDir="column" width="100%">
      <Steps activeStep={activeStep}>
        {steps.map(({ label, content }) => (
          <Step label={label} key={label}>
            {content()}
          </Step>
        ))}
      </Steps>
      {activeStep === steps.length ? (
        <Flex p={4}>
          <Button mx="auto" size="sm" onClick={reset}>
            Reset
          </Button>
        </Flex>
      ) : (
        <Flex width="100%" justify="flex-end">
          <Button
            isDisabled={activeStep === 0}
            mr={4}
            onClick={prevStep}
            size="sm"
            variant="ghost"
          >
            Prev
          </Button>
          <Button size="sm" onClick={nextStep}>
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Flex>
      )}
    </Flex>
  );
}

export default ProgressBar;
