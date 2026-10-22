const API_BASE_URL = 'http://localhost:3000'

export async function getInterviewReports() {
    const response = await fetch(`${API_BASE_URL}/api/interview`, {
        credentials: 'include',
    })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Could not load recent interview plans.')
    }

    if (!Array.isArray(data.reports)) {
        throw new Error('The server response did not include recent interview plans.')
    }

    return data.reports
}

export async function getInterviewReportById(interviewId) {
    const response = await fetch(`${API_BASE_URL}/api/interview/${encodeURIComponent(interviewId)}`, {
        credentials: 'include',
    })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Could not load this interview plan.')
    }

    if (!data.interviewReport) {
        throw new Error('The server response did not include an interview plan.')
    }

    return data.interviewReport
}

export async function regenerateInterviewReportById(interviewId) {
    const response = await fetch(`${API_BASE_URL}/api/interview/${encodeURIComponent(interviewId)}/regenerate`, {
        method: 'POST',
        credentials: 'include',
    })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Could not regenerate this interview plan.')
    }

    if (!data.interviewReport) {
        throw new Error('The server response did not include the regenerated interview plan.')
    }

    return data.interviewReport
}

export async function generateInterviewReport({ jobDescription, selfDescription, resume }) {
    const formData = new FormData()
    formData.append('jobDescription', jobDescription)
    formData.append('selfDescription', selfDescription)
    if (resume) {
        formData.append('resume', resume)
    }

    const response = await fetch(`${API_BASE_URL}/api/interview`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'The interview strategy request failed.')
    }

    if (!data.interviewReport) {
        throw new Error('The server response did not include an interview report.')
    }

    return data.interviewReport
}
