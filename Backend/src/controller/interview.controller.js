const pdfParse = require("pdf-parse")
const mongoose = require("mongoose")
const { generateInterviewReport } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")


async function generateInterViewReportController(req , res) {

    const{ selfDescription, jobDescription }= req.body

    if (!jobDescription?.trim()) {
        return res.status(400).json({ message: "Job description is required." })
    }

    if (!req.file && !selfDescription?.trim()) {
        return res.status(400).json({ message: "Upload a PDF resume or provide a self-description." })
    }

    if (req.file && req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Resume must be a PDF file." })
    }

    const resumeContent = req.file
        ? await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        : { text: "" }

    const interViewReportByAi = await generateInterviewReport({
         resume: resumeContent.text,
         selfDescription,
         jobDescription
    })
    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume:resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi,
        title: interViewReportByAi.title?.trim() || "Interview Preparation Plan"
    })

    res.status(201).json({
        message: "interview report generated successfully.",
        interviewReport
    })

}

/**
 * @description Controller to get interview report ny interviewId
 */

async function getInterviewReportsController(req, res) {
    const reports = await interviewReportModel
        .find({ user: req.user.id })
        .select("title matchScore createdAt")
        .sort({ createdAt: -1 })
        .lean()

    res.json({ reports })
}

async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
        return res.status(400).json({ message: "Invalid interview report ID." })
    }

    const interviewReport = await interviewReportModel
        .findOne({ _id: interviewId, user: req.user.id })
        .lean()

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }

    res.json({ interviewReport })
}

async function regenerateInterviewReportController(req, res) {
    const { interviewId } = req.params
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
        return res.status(400).json({ message: "Invalid interview report ID." })
    }

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id
    })

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }

    if (!interviewReport.jobDescription?.trim()) {
        return res.status(422).json({
            message: "This report has no saved job description. Create a new interview plan instead."
        })
    }

    if (!interviewReport.resume?.trim() && !interviewReport.selfDescription?.trim()) {
        return res.status(422).json({
            message: "This report has no saved resume text or self-description. Create a new interview plan with a profile."
        })
    }

    try {
        const generatedReport = await generateInterviewReport({
            resume: interviewReport.resume || "",
            selfDescription: interviewReport.selfDescription || "",
            jobDescription: interviewReport.jobDescription
        })

        interviewReport.set({
            ...generatedReport,
            title: generatedReport.title?.trim() || interviewReport.title || "Interview Preparation Plan"
        })
        await interviewReport.save()

        return res.json({
            message: "Interview report regenerated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Interview report regeneration failed:", error)
        return res.status(502).json({
            message: error.message || "The interview report could not be regenerated."
        })
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportsController,
    getInterviewReportByIdController,
    regenerateInterviewReportController,
}