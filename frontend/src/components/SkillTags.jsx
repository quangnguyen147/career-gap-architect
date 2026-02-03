import React from "react";

export default function SkillTags({ skills }) {
  return (
    <div className="tags" style={{ marginTop: 20 }}>
      {skills.map((skill, i) => (
        <span key={i} className="tag">
          {skill}
        </span>
      ))}
    </div>
  );
}
