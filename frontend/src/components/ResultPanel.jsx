import React from "react";
import ReactMarkdown from "react-markdown";
import SkillTags from "./SkillTags";
import Questions from "./Questions";
import LearningRoadmap from "./LearningRoadmap";

export default function ResultPanel({ result }) {
  return (
    <div className="result-panel">
      <section>
        <h2 className="heading-2" style={{ color: "#D32F2F" }}>
          Missing Skills
        </h2>
        {/* <SkillTags skills={result.missingSkills} /> */}
        <Questions questions={result.missingSkills || []} type={"skill"} />
      </section>

      <section>
        <h2 className="heading-2">Learning Roadmap</h2>
        <LearningRoadmap steps={result.learningSteps || []} />
      </section>

      <section>
        <h2 className="heading-2">Interview Questions</h2>
        <Questions questions={result.interviewQuestions || []} />
      </section>
    </div>
  );
}
