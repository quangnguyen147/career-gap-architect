import { useState } from "react";
import CustomSelect from "./CustomSelect";
import ResumeDropZone from "./UploadFile";

const MAX_TEXT_LENGTH = 2000;
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const ACCEPT = ".pdf,.doc,.docx,.txt";

export default function InputPanel({
  loading,
  setLoading,
  setError,
  setResult,
}) {
  // Resume
  const [resumeType, setResumeType] = useState("text");
  const [resume, setResume] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  // JD
  const [jdType, setJdType] = useState("text");
  const [jd, setJd] = useState("");
  const [jdFile, setJdFile] = useState(null);

  const validateText = (text, name) => {
    if (!text.trim()) return `${name} không được rỗng`;
    if (text.length > MAX_TEXT_LENGTH)
      return `${name} tối đa ${MAX_TEXT_LENGTH} ký tự`;
    return null;
  };

  const validateFile = (file, name) => {
    if (!file) return `Vui lòng chọn file ${name}`;
    if (!ALLOWED_TYPES.includes(file.type))
      return `${name} chỉ cho phép PDF, DOC, DOCX, TXT`;
    if (file.size > MAX_FILE_SIZE) return `${name} tối đa 20MB`;
    return null;
  };

  const handleAnalyze = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let err;

      // Resume
      if (resumeType === "text") {
        err = validateText(resume, "Resume");
        if (err) throw new Error(err);
      } else {
        err = validateFile(resumeFile, "Resume");
        if (err) throw new Error(err);
      }

      // JD
      if (jdType === "text") {
        err = validateText(jd, "JD");
        if (err) throw new Error(err);
      } else {
        err = validateFile(jdFile, "JD");
        if (err) throw new Error(err);
      }

      const formData = new FormData();

      if (resumeType === "text") formData.append("resume", resume);
      else formData.append("resumeFile", resumeFile);

      if (jdType === "text") formData.append("jd", jd);
      else formData.append("jdFile", jdFile);

      const res = await fetch("http://localhost:4000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData);
        throw new Error(errData || "API error");
      }

      const data = await res.json();

      setResult(data.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="input-panel">
      <div className="input-row">
        <div className="app-item">
          {/* ===== RESUME ===== */}
          <p className="heading-1">Resume</p>

          <div className="select-row">
            <span style={{ fontSize: "16px", fontWeight: 600 }}>Mode:</span>
            <CustomSelect
              value={resumeType}
              onChange={setResumeType}
              options={[
                { value: "text", label: "Text" },
                { value: "file", label: "File" },
              ]}
            />
          </div>

          {resumeType === "text" ? (
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Nhập resume..."
              style={{
                fontSize: "16px",
                height: "197px",
              }}
            />
          ) : (
            <ResumeDropZone
              resumeFile={resumeFile}
              setError={() => {}}
              setResumeFile={setResumeFile}
            />
          )}
        </div>

        <div className="app-item">
          {/* ===== JD ===== */}
          <p className="heading-1">Job Description</p>

          <div className="select-row">
            <span style={{ fontSize: "16px", fontWeight: 600 }}>Mode:</span>
            <CustomSelect
              value={jdType}
              onChange={setJdType}
              options={[
                { value: "text", label: "Text" },
                { value: "file", label: "File" },
              ]}
            />
          </div>

          {jdType === "text" ? (
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Nhập JD..."
              style={{
                fontSize: "16px",
                height: "197px",
              }}
            />
          ) : (
            <ResumeDropZone
              resumeFile={jdFile}
              setError={() => {}}
              setResumeFile={setJdFile}
            />
          )}
        </div>
      </div>

      <button
        disabled={loading}
        onClick={handleAnalyze}
        style={{ fontSize: 16, background: "#1976D2" }}
      >
        {loading ? "Analyzing..." : "Analyze 🚀"}
      </button>
    </div>
  );
}
