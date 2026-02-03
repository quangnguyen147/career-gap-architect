import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export async function extractText(file) {
  const buffer = file.buffer;
  const type = file.mimetype;

  if (type === "application/pdf") {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }

    if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (type.startsWith("text/")) {
    return buffer.toString();
  }

  throw new Error("Unsupported file type");
}
