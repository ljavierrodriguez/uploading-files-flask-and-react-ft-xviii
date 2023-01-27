import { useEffect } from 'react'
import { useState } from 'react'

const RegisterForm = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [avatar, setAvatar] = useState(null)
    const [cv, setCV] = useState(null);

    const [currentUser, setCurrentUser] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault()

        let formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('avatar', avatar);
        formData.append('cv', cv);

        register(formData);
    }


    const register = async (formData) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/register`, {
                method: 'POST',
                body: formData
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

                <div className="form-group mb-3">
                    <label htmlFor="avatar" className="form-label">Avatar:</label>
                    <input type="file" className="form-control" id="avatar" onChange={e => setAvatar(e.target.files[0])} />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="cv" className="form-label">CV:</label>
                    <input type="file" className="form-control" id="cv" onChange={e => setCV(e.target.files[0])} />
                </div>
                <div className="d-grid">
                    <button className="btn btn-primary btn-sm gap-2">
                        Register
                    </button>
                </div>
            </form>

            {
                !!currentUser &&
                (
                    <div className="mx-auto" style={{ width: '200px' }}>
                        <img src={currentUser?.user?.avatar} alt="" width={200} height={200} className="rounded-cicle" />
                        <a href={currentUser?.user?.cv} target={"_blank"} className='btn btn-warning'>Download CV</a>
                    </div>
                )
            }
        </>
    )
}

export default RegisterForm