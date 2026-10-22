const mongoose = require("mongoose");


/**
 * -job description: This schema defines the structure of the interview report document in the database. It includes fields for candidate name, interviewer name, interview date, feedback, and rating.
 * -resume text: The resume text field is used to store the candidate's resume content as a string. This allows for easy retrieval and display of the candidate's qualifications during the interview process.
 * - self description: The self description field is used to store the candidate's self-introduction or personal statement. It provides insight into the candidate's background, skills, and motivations, which can be valuable for interviewers when assessing their suitability for the role.
 * -overall score: The overall score field is used to store the candidate's overall performance rating in the interview. It can be a numerical value or a categorical rating (e.g., "Excellent," "Good," "Average," "Poor") that summarizes the candidate's performance across various evaluation criteria.
 * 
 * -technical questions: The technical questions field is an array of strings that stores the technical questions asked during the interview. This allows for a record of the specific questions posed to the candidate, which can be useful for evaluating their technical knowledge and problem-solving abilities.
 * -technical answers: The technical answers field is an array of strings that stores the candidate's responses to the technical questions. This allows for a record of the candidate's answers, which can be used to assess their understanding of technical concepts and their ability to articulate solutions.
 * -behavioral questions: The behavioral questions field is an array of strings that stores the behavioral questions asked during the interview. This allows for a record of the specific questions posed to the candidate, which can be useful for evaluating their interpersonal skills, teamwork, and problem-solving abilities.
 * -behavioral answers: The behavioral answers field is an array of strings that stores the candidate's responses to the behavioral questions. This allows for a record of the candidate's answers, which can be used to assess their communication skills, adaptability, and ability to handle challenging situations.
 * 
 * -skill gaps:[{
 * skill:""
 * severity:""
 * type:string
 * enum:["low","medium","high"]
 * }]
 * 
 * -prepration plan :[{
 *           day: Number,
 *          topic: String,
 *          tasks: [String],
 *          focusAreas: [String],
 * }]
 * 
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }
}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [ true, "Skill is required" ]
    },
    severity: {
        type: String,
        enum: [ "low", "medium", "high" ],
        required: [ true, "Severity is required" ]
    }
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [ true, "Day is required" ]
    },
    focus: {
        type: String,
        required: [ true, "Focus is required" ]
    },
    tasks: [ {
        type: String,
        required: [ true, "Task is required" ]
    } ]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [ true, "Job description is required" ]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [ technicalQuestionSchema ],
    behavioralQuestions: [ behavioralQuestionSchema ],
    skillGaps: [ skillGapSchema ],
    preparationPlan: [ preparationPlanSchema ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [ true, "Job title is required" ]
    }
}, {
    timestamps: true
})


const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;  