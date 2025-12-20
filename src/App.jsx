import { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f0f0f', color: 'white' }}>
        <h2>Loading...</h2>
      </div>
    )
  }

  return (
    <GoogleOAuthProvider 
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      onScriptLoad={() => {
        // Ensure Google Script is loaded properly
        window.google?.accounts?.id?.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: () => {},
        });
      }}
    >
      {!user ? (
        <LandingPage onLoginSuccess={setUser} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </GoogleOAuthProvider>
  )
}

export default App
