import { useState } from 'react'
import './App.css'
import Login from './components/Login'

function App() {
  const [access, setaccess] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const handleLogin = (user) => {
    setaccess(true)
    setCurrentUser(user)
    console.log("Usuario logeado: ", user)
  }

  const handleLogut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setaccess(false)
    setCurrentUser(null)
  }

  return (
    <>
      <h1>App de Login</h1>
      {!access ? 
        <Login onLog={handleLogin}/>
        : (<div>
            <h2>Bienvenido {currentUser.username}</h2>
            <button onClick={handleLogut}>Logout</button>
        </div>)}
    </>
  )
}

export default App
