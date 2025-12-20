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
    
    // Add a small delay to ensure Google popup is fully closed
    await new Promise(resolve => setTimeout(resolve, 100))
    
    try {
      if (!credentialResponse?.credential) {
        throw new Error('No credential received from Google')
      }

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
      if (data.success && data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        // Add a small delay before redirect to ensure storage is saved
        setTimeout(() => {
          onLoginSuccess(data.user)
        }, 100)
      } else {
        setError('Login failed. Please try again.')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Login failed:', err)
      setError(err.message || 'Login failed. Please try again.')
      setIsLoading(false)
    }
  }

  const handleGoogleError = (error) => {
    console.error('Google Login Error:', error)
    setError('Google login failed. Please check your internet connection and try again.')
    setIsLoading(false)
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
                useOneTap={false}
                auto_select={false}
                ux_mode="popup"
                hosted_domain=""
              />
            </div>
            
            <p className="login-note">Sign in with your Google account to get started</p>
          </div>
        </div>
      </div>
    </div>
  )
}
