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
  const [activeStep, setActiveStep] = useState(0);
  const prevStep = () => {
    setActiveStep((activeStep) => (activeStep > 0 ? activeStep - 1 : 0));
  };

  const nextStep = () => {
    setActiveStep((prevState) => prevState + 1);
  };

  const reset = () => {
    setActiveStep(0);
  };

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
