import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api"


export const useAuth =()=>{
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading, authError, setAuthError } = context

        
    const handleLogin = async({ email, password})=>{
        setLoading(true)
        setAuthError("")
        try{
            const data= await login ({email , password})
            setUser(data.user)
            return true
        } catch (error) {
            setAuthError(error.response?.data?.message || error.message || "Login failed.")
            return false
        }
        finally {
            setLoading(false)
        }
    }
    const handleRegister = async({ username , email, password})=>{
        setLoading(true)
        setAuthError("")
        try{
            const data= await register ({ username, email , password})
            setUser(data.user)
            return true
        } catch (error) {
            setAuthError(error.response?.data?.message || error.message || "Registration failed.")
            return false
        }
        finally {
            setLoading(false)
        }
    }

    const handleLogout = async()=>{
        setLoading(true)
        setAuthError("")
        try {
            await logout()
            setUser(null)
        } catch (error) {
            setAuthError(error.response?.data?.message || error.message || "Logout failed.")
        } finally {  
            setLoading(false) 
        }
    }

    return {
        user,
        loading,
        authError,
        handleLogin,
        handleRegister,
        handleLogout
    }

}