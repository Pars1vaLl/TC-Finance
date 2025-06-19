// Google OAuth 2.0 with PKCE implementation
export interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  given_name: string
  family_name: string
}

export interface AuthTokens {
  access_token: string
  id_token: string
  expires_in: number
  token_type: string
}

// Generate PKCE code verifier and challenge
function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'
const GOOGLE_REDIRECT_URI = window.location.origin + '/auth/callback'
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

// Scopes for Google OAuth
const SCOPES = [
  'openid',
  'profile',
  'email'
].join(' ')

export class GoogleAuthService {
  private static instance: GoogleAuthService
  private codeVerifier: string | null = null

  static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService()
    }
    return GoogleAuthService.instance
  }

  async login(): Promise<void> {
    try {
      // Generate PKCE code verifier and challenge
      this.codeVerifier = generateCodeVerifier()
      const codeChallenge = await generateCodeChallenge(this.codeVerifier)

      // Store code verifier in session storage
      sessionStorage.setItem('code_verifier', this.codeVerifier)

      // Build authorization URL
      const authUrl = new URL(GOOGLE_AUTH_URL)
      authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID)
      authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI)
      authUrl.searchParams.set('response_type', 'code')
      authUrl.searchParams.set('scope', SCOPES)
      authUrl.searchParams.set('code_challenge', codeChallenge)
      authUrl.searchParams.set('code_challenge_method', 'S256')
      authUrl.searchParams.set('access_type', 'offline')
      authUrl.searchParams.set('prompt', 'consent')

      // Redirect to Google OAuth
      window.location.href = authUrl.toString()
    } catch (error) {
      console.error('Login error:', error)
      throw new Error('Failed to initiate login')
    }
  }

  async handleCallback(code: string): Promise<GoogleUser> {
    try {
      const codeVerifier = sessionStorage.getItem('code_verifier')
      if (!codeVerifier) {
        throw new Error('No code verifier found')
      }

      // Exchange code for tokens
      const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          redirect_uri: GOOGLE_REDIRECT_URI,
          code,
          code_verifier: codeVerifier,
          grant_type: 'authorization_code',
        }),
      })

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for tokens')
      }

      const tokens: AuthTokens = await tokenResponse.json()

      // Get user info
      const userResponse = await fetch(GOOGLE_USERINFO_URL, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })

      if (!userResponse.ok) {
        throw new Error('Failed to get user info')
      }

      const user: GoogleUser = await userResponse.json()

      // Store tokens and user info
      localStorage.setItem('auth_token', tokens.access_token)
      localStorage.setItem('id_token', tokens.id_token)
      localStorage.setItem('user_data', JSON.stringify(user))

      // Clean up
      sessionStorage.removeItem('code_verifier')

      return user
    } catch (error) {
      console.error('Callback error:', error)
      throw new Error('Failed to complete authentication')
    }
  }

  logout(): void {
    // Clear all stored data
    localStorage.removeItem('auth_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('user_data')
    sessionStorage.removeItem('code_verifier')

    // Redirect to login page
    window.location.href = '/login'
  }

  getStoredUser(): GoogleUser | null {
    const userData = localStorage.getItem('user_data')
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (error) {
        console.error('Error parsing user data:', error)
        return null
      }
    }
    return null
  }

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken() && !!this.getStoredUser()
  }

  // Determine user role based on email domain
  getUserRole(email: string): 'Admin' | 'Clerk' | 'Viewer' {
    const domain = email.split('@')[1]?.toLowerCase()
    
    // Example role assignment based on domain
    // You can customize this logic based on your organization
    if (domain === 'admin.yourcompany.com') {
      return 'Admin'
    } else if (domain === 'warehouse.yourcompany.com') {
      return 'Clerk'
    } else {
      return 'Viewer'
    }
  }
}

export const authService = GoogleAuthService.getInstance() 