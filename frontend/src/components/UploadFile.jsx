const MAX_SIZE_MB = 5;
const ACCEPT_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt"];

export default function ResumeDropZone({
  resumeFile,
  setResumeFile,
  loading,
  setError,
}) {
  const ACCEPT = ".pdf,.doc,.docx,.txt";

  const getFileExtension = (file) =>
    "." + file.name.split(".").pop().toLowerCase();

  const handleFile = (file) => {
    const ext = getFileExtension(file);

    if (!ACCEPT_EXTENSIONS.includes(ext)) {
      setError("Chỉ chấp nhận PDF, DOC, DOCX hoặc TXT");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File tối đa ${MAX_SIZE_MB}MB`);
      return;
    }

    setError("");
    setResumeFile(file);
  };

  return (
    <div
      className={`drop-zone 
        ${resumeFile ? "has-file success" : ""} 
        ${loading ? "loading" : ""}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
    >
      <input
        type="file"
        accept={ACCEPT}
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />

      {!resumeFile ? (
        <div className="placeholder">
          <div className="icon">⬆️</div>
          <p>Drag & drop Resume hoặc click để chọn file</p>
          <small>PDF · Tối đa {MAX_SIZE_MB}MB</small>
        </div>
      ) : (
        <div className="file-preview">
          <span className="file-icon">📄</span>

          <div className="file-info">
            <strong>{resumeFile.name}</strong>
            <small>{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</small>
          </div>

          {!loading && (
            <button
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                setResumeFile(null);
              }}
            >
              ✕
            </button>
          )}
        </div>
      )}

      {loading && <div className="loading-bar" />}
    </div>
  );
}
