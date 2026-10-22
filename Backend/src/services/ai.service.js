const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");


const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
})




const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("At least 3 technical interview questions, each with its intention and a suggested answer"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("At least 3 behavioral interview questions, each with its intention and a suggested answer"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A preparation plan with at least 3 days, each with focus and tasks"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

const interviewReportJsonSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "number",
      description: "A score from 0 to 100 indicating how well the candidate matches the role."
    },
    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "intention", "answer"]
      }
    },
    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "intention", "answer"]
      }
    },
    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] }
        },
        required: ["skill", "severity"]
      }
    },
    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          focus: { type: "string" },
          tasks: { type: "array", items: { type: "string" } }
        },
        required: ["day", "focus", "tasks"]
      }
    },
    title: { type: "string", description: "The job title for the interview report." }
  },
  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
    "title"
  ]
}

async function generateInterviewReport({resume, selfDescription, jobDescription}) {
  const prompt=`Generate a complete interview preparation report matching the provided JSON schema exactly.
  Provide at least 3 technicalQuestions, at least 3 behavioralQuestions, and at least 3 preparationPlan days. Every question must be an object with question, intention, and answer strings. Every skillGaps item must be an object with skill and severity ("low", "medium", or "high"). Each preparationPlan item must be an object with numeric day, focus string, and tasks array of strings. Set matchScore to a number from 0 to 100 and title to a non-empty job title. Use empty skillGaps only if there are no relevant gaps.

  Resume: ${resume || "Not provided"}
  Self-description: ${selfDescription || "Not provided"}
  Job description: ${jobDescription}`


  const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: interviewReportJsonSchema
        }
    })
  if (!response.text) {
    throw new Error("The AI service returned an empty interview report.")
  }

  let generatedReport
  try {
    generatedReport = JSON.parse(response.text)
  } catch {
    throw new Error("The AI service returned invalid JSON for the interview report.")
  }

  const validation = interviewReportSchema.safeParse(generatedReport)
  if (!validation.success) {
    const details = validation.error.issues
      .map((issue) => `${issue.path.join(".") || "report"}: ${issue.message}`)
      .join("; ")
    throw new Error(`The AI-generated interview report is incomplete: ${details}`)
  }

  const report = validation.data
  const completenessIssues = []
  if (report.matchScore < 0 || report.matchScore > 100) {
    completenessIssues.push("matchScore must be between 0 and 100")
  }
  if (report.technicalQuestions.length < 3) {
    completenessIssues.push("at least 3 technical questions are required")
  }
  if (report.behavioralQuestions.length < 3) {
    completenessIssues.push("at least 3 behavioral questions are required")
  }
  if (report.preparationPlan.length < 3) {
    completenessIssues.push("at least 3 preparation days are required")
  }
  if (!report.title.trim()) {
    completenessIssues.push("a non-empty job title is required")
  }
  if (completenessIssues.length > 0) {
    throw new Error(`The AI-generated interview report is incomplete: ${completenessIssues.join("; ")}`)
  }

  return { ...report, title: report.title.trim() }

}




module.exports = { generateInterviewReport }
