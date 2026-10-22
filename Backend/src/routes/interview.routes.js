const express =require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controller/interview.controller")
const upload = require("../middlewares/file.middleware"
)


const interviewRouter = express.Router()

/**
 * @route  POST /api/interview
 * @description genterate new intewview report on the basis of user self description , resume pdf and job description.
 * @access private 
 */

interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)
interviewRouter.get("/", authMiddleware.authUser, interviewController.getInterviewReportsController)
interviewRouter.get("/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)
interviewRouter.post("/:interviewId/regenerate", authMiddleware.authUser, interviewController.regenerateInterviewReportController)

module.exports= interviewRouter