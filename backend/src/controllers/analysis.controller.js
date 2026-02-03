import { runAnalysis } from "../services/analysis.service.js";
import { extractText } from "../utils/fileParser.util.js";
import { guardInput } from "../utils/inputGuard.util.js";


export async function analyze(req, res, next) {
    try {

        let resume = req.body.resume || "";
        let jd = req.body.jd || "";


        if (req.files?.resumeFile) {
            resume = await extractText(req.files.resumeFile[0]);
        }


        if (req.files?.jdFile) {
            jd = await extractText(req.files.jdFile[0]);
        }


        const guarded = guardInput(resume, jd);
        resume = guarded.resume;
        jd = guarded.jd;


        const data = await runAnalysis(resume, jd);
        res.status(200).json({
            success: true,
            status: 200,
            data
        });
    } catch (e) {
        next(e);
    }
}
