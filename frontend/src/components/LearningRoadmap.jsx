import {
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
} from "@chakra-ui/react";

const LearningRoadmap = ({ steps }) => {
  const { activeStep } = useSteps({
    index: steps.length,
    count: steps.length,
  });

  return (
    <Stepper
      index={activeStep}
      orientation="vertical"
      gap="0"
      mt={"20px"}
      width={"100%"}
    >
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box width={"100%"}>
            <StepTitle>Step {index + 1}</StepTitle>
            <StepDescription whiteSpace={"wrap"} py={"10px"}>
              {step}
            </StepDescription>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
};

export default LearningRoadmap;
