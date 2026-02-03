import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

const Questions = ({ questions, type }) => {
  return (
    <Accordion mt={"20px"} defaultIndex={[0]}>
      {questions.map((item, index) => (
        <AccordionItem key={index}>
          <h2>
            <AccordionButton bg={type === "skill" ? "#FFE2E2" : "#fafafa"}>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                fontWeight={600}
                color={type === "skill" ? "#D32F2F" : "#000"}
              >
                {type === "skill" ? "Skill" : "Question"} {index + 1}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>{item}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Questions;
