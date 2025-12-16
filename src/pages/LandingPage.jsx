import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import jwtDecode from 'jwt-decode'
import './LandingPage.css'

export default function LandingPage({ onLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true)
    setError('')
    try {
      const decoded = jwtDecode(credentialResponse.credential)
      
      // Send to backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          profilePicture: decoded.picture,
        }),
      })

      const data = await response.json()
      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        onLoginSuccess(data.user)
      } else {
        setError('Login failed. Please try again.')
      }
    } catch (err) {
      console.error('Login failed:', err)
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.')
  }

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-content">
          <h1 className="landing-title">💪 Gym Logger</h1>
          <p className="landing-subtitle">Track Your Fitness Journey</p>
          
          <div className="landing-features">
            <div className="feature">
              <span className="feature-icon">📊</span>
              <p>Track all your workouts</p>
            </div>
            <div className="feature">
              <span className="feature-icon">📈</span>
              <p>View your progress</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <p>Achieve your goals</p>
            </div>
          </div>

          <div className="login-section">
            <p className="login-text">Get Started Today</p>
            
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signin_with"
                size="large"
              />
            </div>
            
            <p className="login-note">Sign in with your Google account to get started</p>
          </div>
        </div>
      </div>
    </div>
  )
}
