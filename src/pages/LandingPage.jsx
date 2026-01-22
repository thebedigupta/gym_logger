import { useMemo, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import jwtDecode from 'jwt-decode'
import './LandingPage.css'

const stats = [
  { label: 'Adherence', value: '3.4x', detail: 'more consistent than paper logs' },
  { label: 'Time saved', value: '12m', detail: 'per session with quick logging' },
  { label: 'Portability', value: 'CSV', detail: 'one-tap export for coaches' },
]

const differentiators = [
  'Built for web first—no install, instant sync on every device.',
  'Performance dashboards tuned for lifters, not step counters.',
  'Data ownership: your metrics stay portable and exportable.',
  'Zero dark patterns—fast in, fast out, no distractions.',
]

const impactRings = [
  { label: 'Flow', value: 86 },
  { label: 'Clarity', value: 92 },
  { label: 'Speed', value: 88 },
  { label: 'Focus', value: 90 },
]

const personalFeatures = [
  'Personal volume trends and streaks that highlight momentum.',
  'Smart defaults for sets/reps/weight based on your last session.',
  'Skip-day logging to keep streak honesty while staying realistic.',
  'Lightweight notes to capture cues, pains, and form reminders.',
]

const devLinks = [
  { label: 'GitHub', href: 'https://github.com/thebedigupta' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bedigupta/' },
  { label: 'Email', href: 'mailto:bedigupta76@gmail.com' },
]

const chartBars = [
  { label: 'Strength', value: 88 },
  { label: 'Consistency', value: 94 },
  { label: 'Recovery', value: 72 },
  { label: 'Focus', value: 81 },
  { label: 'Speed', value: 76 },
]

export default function LandingPage({ onLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const apiUrl = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:5000', [])

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true)
    setError('')

    await new Promise(resolve => setTimeout(resolve, 100))

    try {
      if (!credentialResponse?.credential) {
        throw new Error('No credential received from Google')
      }

      const decoded = jwtDecode(credentialResponse.credential)

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
        setTimeout(() => {
          onLoginSuccess(data.user)
        }, 100)
      } else {
        setError('Login failed. Please try again.')
        setIsLoading(false)
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError('Google login failed. Please check your internet connection and try again.')
    setIsLoading(false)
  }

  const updateFeedback = (field, value) => {
    setFeedback(prev => ({ ...prev, [field]: value }))
  }

  const submitFeedback = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setFeedback({ name: '', email: '', message: '' })
    setTimeout(() => setSubmitted(false), 3000)
  }

  const scrollToId = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="landing-page">
      <header className="lp-hero" id="top">
        <nav className="lp-nav">
          <div className="lp-brand">🏋️ Localhost Gym</div>
          <div className="lp-nav-links">
            <button onClick={() => scrollToId('about')}>About</button>
            <button onClick={() => scrollToId('differentiators')}>Why Us</button>
            <button onClick={() => scrollToId('personal')}>Personal</button>
            <button onClick={() => scrollToId('developer')}>Developer</button>
            <button onClick={() => scrollToId('contact')}>Contact</button>
            <button className="lp-signin" onClick={() => scrollToId('signin')}>Sign In</button>
          </div>
        </nav>

        <div className="lp-hero-grid">
          <div className="lp-hero-copy">
            <p className="lp-pill">Web-first strength logging</p>
            <h1>Train smart. Log faster.</h1>
            <p className="lp-lead">A focused tracker with zero clutter. Own your data, stay consistent, and glide through sets without breaking flow.</p>
            <div className="lp-cta-row">
              <button className="lp-primary" onClick={() => scrollToId('signin')}>Start free</button>
              <button className="lp-secondary" onClick={() => scrollToId('about')}>Learn more</button>
            </div>
            <div className="lp-meta-row">
              <span>Instant sync across devices</span>
              <span>Export anytime</span>
              <span>Privacy-first</span>
            </div>
            <div className="lp-stat-strip">
              <div className="lp-stat-card">
                <div className="lp-stat-card-value">1,200+</div>
                <div className="lp-stat-card-label">Workouts logged</div>
              </div>
              <div className="lp-stat-card">
                <div className="lp-stat-card-value">12m</div>
                <div className="lp-stat-card-label">Session time saved</div>
              </div>
              <div className="lp-stat-card">
                <div className="lp-stat-card-value">99.9%</div>
                <div className="lp-stat-card-label">Uptime & reliability</div>
              </div>
            </div>

            <div className="lp-hero-highlights">
              <div className="lp-hero-card">⚡ Fast logging flow</div>
              <div className="lp-hero-card">🔒 Own & export your data</div>
              <div className="lp-hero-card">🌐 Works everywhere</div>
              <div className="lp-hero-card">🎧 Zero distractions</div>
            </div>
          </div>
        </div>
      </header>

      <main className="lp-main">
        <section className="lp-section lp-full" id="about">
          <div className="lp-section-head">
            <p className="lp-pill">About</p>
            <h2>Your training, clearly told</h2>
            <p className="lp-section-sub">We built Localhost Gym to keep the first screen clean—just enough to feel the brand—then guide you into the details when you’re ready.</p>
          </div>
          <div className="lp-grid three">
            <div className="lp-card">📊 Granular sets, reps, weight, rest, and notes in one flow.</div>
            <div className="lp-card">🚀 Fast-loading web experience that syncs instantly—no installs.</div>
            <div className="lp-card">🔒 Privacy-first: your logs stay yours with export on demand.</div>
          </div>
          <div className="lp-highlight-grid">
            {stats.map((item) => (
              <div key={item.label} className="lp-highlight">
                <div className="lp-highlight-value">{item.value}</div>
                <div className="lp-highlight-label">{item.label}</div>
                <p className="lp-highlight-detail">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-section lp-full" id="differentiators">
          <div className="lp-section-head">
            <p className="lp-pill">Why we stand out</p>
            <h2>Industry reality vs. Localhost Gym</h2>
            <p className="lp-section-sub">Most fitness apps chase engagement; we chase clarity and speed.</p>
          </div>
          <div className="lp-list">
            {differentiators.map((item) => (
              <div key={item} className="lp-list-item">{item}</div>
            ))}
          </div>
          <div className="lp-rings">
            {impactRings.map((ring) => (
              <div key={ring.label} className="lp-ring">
                <svg viewBox="0 0 120 120">
                  <circle className="lp-ring-track" cx="60" cy="60" r="46" />
                  <circle
                    className="lp-ring-fill"
                    cx="60"
                    cy="60"
                    r="46"
                    strokeDasharray={`${Math.round(2 * Math.PI * 46)}`}
                    strokeDashoffset={`${Math.round(2 * Math.PI * 46 * (1 - ring.value / 100))}`}
                  />
                </svg>
                <div className="lp-ring-value">{ring.value}%</div>
                <div className="lp-ring-label">{ring.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-section lp-full" id="personal">
          <div className="lp-section-head">
            <p className="lp-pill">Personal touches</p>
            <h2>Features that feel yours</h2>
            <p className="lp-section-sub">Designed to keep you honest, motivated, and in control.</p>
          </div>
          <div className="lp-grid two">
            {personalFeatures.map((item) => (
              <div key={item} className="lp-card">{item}</div>
            ))}
          </div>
          <div className="lp-chart">
            {chartBars.map(bar => (
              <div key={bar.label} className="lp-bar">
                <div className="lp-bar-fill" style={{ height: `${bar.value}%` }} />
                <span className="lp-bar-label">{bar.label}</span>
              </div>
            ))}
            <div className="lp-chart-note">A quick glance at balance: consistency, strength, recovery, focus.</div>
          </div>
        </section>

        <section className="lp-section" id="developer">
          <div className="lp-section-head">
            <p className="lp-pill">Behind the build</p>
            <h2>Hi, Folks</h2>
            <p className="lp-section-sub">Full-stack dev obsessed with clean UX and reliable data handling.</p>
          </div>
          <div className="lp-grid two">
            <div className="lp-card">
              Built with React, Vite, Express, MongoDB, and JWT auth to keep your sessions fast and secure.
            </div>
            <div className="lp-card lp-links">
              {devLinks.map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-section" id="contact">
          <div className="lp-section-head">
            <p className="lp-pill">Contact & Feedback</p>
            <h2>Tell us what you need</h2>
            <p className="lp-section-sub">Feature ideas, bug reports, or coaching workflows—drop a note.</p>
          </div>
          <form className="lp-form" onSubmit={submitFeedback}>
            <div className="lp-form-grid">
              <label>
                Name
                <input
                  type="text"
                  value={feedback.name}
                  onChange={(e) => updateFeedback('name', e.target.value)}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={feedback.email}
                  onChange={(e) => updateFeedback('email', e.target.value)}
                  required
                />
              </label>
            </div>
            <label>
              Message
              <textarea
                rows="4"
                value={feedback.message}
                onChange={(e) => updateFeedback('message', e.target.value)}
                required
              />
            </label>
            <button type="submit" className="lp-primary">Send feedback</button>
            {submitted && <p className="lp-success">Thanks for sharing! We read every note.</p>}
          </form>
        </section>

        <section className="lp-section" id="signin">
          <div className="lp-section-head">
            <p className="lp-pill">Sign in</p>
            <h2>Ready to log?</h2>
            <p className="lp-section-sub">Use your Google account to get started in seconds.</p>
          </div>

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
          <p className="login-note">Sign in with Google. No spam, ever.</p>
          {isLoading && <p className="lp-loading">Signing you in...</p>}
        </section>
      </main>
    </div>
  )
}
