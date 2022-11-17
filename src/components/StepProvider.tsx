import { useSteps } from "chakra-ui-steps";
import { createContext, ReactNode, useContext, useState } from "react";

interface StepContextInterface {
  activeStep: number;
  prevStep: () => void;
  nextStep: () => void;
  reset: () => void;
}

const StepContext = createContext<StepContextInterface>(
  {} as StepContextInterface
);

const StepContextProvider = ({ children }: { children: ReactNode }) => {
  // const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
  //   initialStep: 0,
  // });

  const [activeStep, setActiveStep] = useState(0);
  const prevStep = () => {
    const newStep = activeStep > 0 ? activeStep - 1 : 0;
    setActiveStep(newStep);
  };

  const nextStep = () => {
    const newStep = activeStep + 1;
    setActiveStep(newStep);
  };

  const reset = () => {
    setActiveStep(0)
  }

  console.log("useMap");

  return (
    <StepContext.Provider
      value={{
        nextStep,
        prevStep,
        reset,
        activeStep,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};

export const useStep = () => useContext(StepContext);

export default StepContextProvider;
