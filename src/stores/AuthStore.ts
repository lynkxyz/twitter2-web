export const AuthStore = {
  currentUser: null,
  callback: (data: any) => {},
  async login(data: any) {
    window.localStorage.setItem("auth", JSON.stringify(data))
    this.currentUser = data
    if (this.callback) {
      this.callback(data)
    }
  },
  getCurrentUser() {
    return this.currentUser
  },
  logout() {
    delete this.currentUser
    window.localStorage.clear()
    if (this.callback) {
      this.callback(undefined)
    }
  },
  subscribe(callback: (data: any) => void) {
    this.callback = callback
    return () => {
      this.callback = undefined as any
    }
  }
}
