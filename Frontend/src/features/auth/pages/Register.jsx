import React from 'react'
import '../auth.form.scss'
import  {Link, useNavigate} from 'react-router'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const navigate = useNavigate()
    const[username, setUsername] = useState("")   
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { loading, authError, handleRegister } = useAuth()



    const handleSubmit = async (e) => {
        e.preventDefault()
        // Handle registration logic here
        if (await handleRegister({ username, email, password })) {
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
                <h1>Register</h1>
                <form action="" onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="Username">Username</label>
                        <input type="text" name="name" id="Username" placeholder='Enter username' onChange={(e)=>{setUsername(e.target.value)}} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder='Enter email' onChange={(e)=>{setEmail(e.target.value)}} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder='Enter password' onChange={(e)=>{setPassword(e.target.value)}} />
                    </div>

                    {authError && <p role="alert">{authError}</p>}
                    <button type="submit" className='button primary-button'>Register</button>
                </form>

                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </main>
    )
}

export default Register