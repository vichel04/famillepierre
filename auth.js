class AuthManager {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
    this.onLogin = null;   // callback à définir depuis l'extérieur
    this.onLogout = null;  // callback à définir depuis l'extérieur
  }

  async checkExistingSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    if (session) {
      this._triggerLogin();
      return true;
    }
    return false;
  }

  async login(email, password) {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, message: 'Email ou mot de passe incorrect.' };
    }
    this._triggerLogin();
    return { success: true };
  }

  async logout() {
    await this.supabase.auth.signOut();
    if (typeof this.onLogout === 'function') this.onLogout();
  }

  _triggerLogin() {
    if (typeof this.onLogin === 'function') this.onLogin();
  }
}