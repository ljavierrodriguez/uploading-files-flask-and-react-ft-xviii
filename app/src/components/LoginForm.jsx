import { useEffect } from 'react'
import { useState } from 'react'

const LoginForm = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")


    const [currentUser, setCurrentUser] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault()

        let formData = {
            username,
            password
        }

        login(formData);
    }


    const login = async (formData) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()

            if (data.user.id) {
                setCurrentUser(data)
                sessionStorage.setItem('currentUser', JSON.stringify(data));
                console.log(data);
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        checkCurrentUser();
    }, [])

    const checkCurrentUser = () => {
        if(sessionStorage.getItem('currentUser')){
            setCurrentUser(JSON.parse(sessionStorage.getItem('currentUser')));
        }
    }

    return (
        <>

            <form onSubmit={handleSubmit} style={{ width: '50%', margin: '0 auto' }}>
                <div className="form-group mb-3">
                    <label htmlFor="username" className="form-label">Username:</label>
                    <input type="email" className="form-control" id="username" placeholder='john.doe@gmail.com' onChange={e => setUsername(e.target.value)} value={username} />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input type="password" className="form-control" id="password" placeholder='********' onChange={e => setPassword(e.target.value)} value={password} />
                </div>

                <div className="d-grid">
                    <button className="btn btn-primary btn-sm gap-2">
                        Login
                    </button>
                </div>
            </form>
        </>
    )
}

export default LoginForm