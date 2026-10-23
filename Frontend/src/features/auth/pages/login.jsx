import React from 'react'
import '../auth.form.scss'   
import  {Link, useNavigate} from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'


const Login = () => {
    
    const { loading, authError, handleLogin } = useAuth()
    const navigate = useNavigate()


    const [ email , setEmail]=useState("")
    const [password, setPassword] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (await handleLogin({ email, password })) {
            navigate("/")
        }
    }

    if(loading){
        return ( <main><h1>Loading.....</h1></main>
        )
    }
    
  return (
    <main>
        <div className="form_container">
            <h1> Login</h1>
            <form action="" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder='Enter email' onChange={(e)=>{ setEmail(e.target.value)}} />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder='Enter password' onChange={(e)=>{ setPassword(e.target.value)}}/>
                </div>

                {authError && <p role="alert">{authError}</p>}
                <button type="submit" className='button primary-button'>Login</button>
            </form>

            <p>Don't have an account? <Link to="/register">Register</Link> </p>


        </div>
    </main>
  )
}

export default Login