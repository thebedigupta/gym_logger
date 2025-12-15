import { useState } from 'react'
import './LandingPage.css'

export default function LandingPage({ onLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false)

  // Demo login without Google OAuth for now
  const handleDemoLogin = async () => {
    setIsLoading(true)
    try {
      // Create a demo user
      const demoUser = {
        _id: '123456789',
        name: 'Demo User',
        email: 'demo@example.com',
        profilePicture: 'https://via.placeholder.com/40',
      }

      // Generate a fake token
      const fakeToken = 'demo-token-' + Date.now()
      
      localStorage.setItem('token', fakeToken)
      localStorage.setItem('user', JSON.stringify(demoUser))
      onLoginSuccess(demoUser)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
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
            <button 
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="demo-login-btn"
            >
              {isLoading ? 'Loading...' : '🚀 Start Demo'}
            </button>
            <p className="demo-note">Click to start with demo account</p>
          </div>
        </div>
      </div>
    </div>
  )
}
