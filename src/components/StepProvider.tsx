import { useSteps } from "chakra-ui-steps";
import { createContext, ReactNode, useContext, useRef } from "react";

interface StepContextInterface {
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  reset: () => void;
  activeStep: number;
}

const StepContext = createContext<StepContextInterface>({} as StepContextInterface);

const StepContextProvider = ({ children }: { children: ReactNode }) => {
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });
  console.log('useMap');
  
  return (
    <StepContext.Provider
      value={{
        nextStep,
        prevStep,
        setStep,
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
