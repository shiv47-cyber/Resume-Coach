import { useCallback, useContext } from 'react'
import { InterviewContext } from '../interview.context.jsx'
import {
    generateInterviewReport as requestInterviewReport,
    getInterviewReportById as requestInterviewReportById,
    getInterviewReports as requestInterviewReports,
    regenerateInterviewReportById as requestRegenerateInterviewReport,
} from '../services/interview.api.js'

export function useInterview() {
    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error('useInterview must be used within an InterviewProvider.')
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
        error,
        setError,
    } = context

    const loadReports = async () => {
        setLoading(true)
        setError('')

        try {
            const interviewReports = await requestInterviewReports()
            setReports(interviewReports)
            return interviewReports
        } catch (requestError) {
            setError(requestError.message || 'Could not load interview plans.')
            throw requestError
        } finally {
            setLoading(false)
        }
    }

    const generateReport = async (details) => {
        setLoading(true)
        setError('')

        try {
            const generatedReport = await requestInterviewReport(details)
            setReport(generatedReport)
            setReports((currentReports) => [
                generatedReport,
                ...currentReports.filter((item) => item._id !== generatedReport._id),
            ])
            return generatedReport
        } catch (requestError) {
            setError(requestError.message || 'Could not generate the interview plan.')
            throw requestError
        } finally {
            setLoading(false)
        }
    }

    const getReportById = useCallback(async (interviewId) => {
        setLoading(true)
        setError('')
        setReport(null)

        try {
            const interviewReport = await requestInterviewReportById(interviewId)
            setReport(interviewReport)
            return interviewReport
        } catch (requestError) {
            setError(requestError.message || 'Could not load this interview plan.')
            throw requestError
        } finally {
            setLoading(false)
        }
    }, [setError, setLoading, setReport])

    const regenerateReport = useCallback(async (interviewId) => {
        setLoading(true)
        setError('')

        try {
            const regeneratedReport = await requestRegenerateInterviewReport(interviewId)
            setReport(regeneratedReport)
            setReports((currentReports) => currentReports.map((item) => (
                item._id === regeneratedReport._id
                    ? { ...item, ...regeneratedReport }
                    : item
            )))
            return regeneratedReport
        } catch (requestError) {
            setError(requestError.message || 'Could not regenerate this interview plan.')
            throw requestError
        } finally {
            setLoading(false)
        }
    }, [setError, setLoading, setReport, setReports])

    const downloadResumeText = () => {
        if (!report?.resume) {
            const downloadError = new Error('This interview plan does not contain resume text.')
            setError(downloadError.message)
            throw downloadError
        }

        const resumeFile = new Blob([report.resume], { type: 'text/plain;charset=utf-8' })
        const downloadUrl = URL.createObjectURL(resumeFile)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `${report.title || 'interview-resume'}.txt`
        link.click()
        URL.revokeObjectURL(downloadUrl)
    }

    const clearError = () => setError('')

    return {
        loading,
        report,
        reports,
        error,
        loadReports,
        generateReport,
        getReportById,
        regenerateReport,
        downloadResumeText,
        clearError,
    }
}

export default useInterview