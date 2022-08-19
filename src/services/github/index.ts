import axios from 'axios'

interface IGithubCallback {
  access_token: string,
  token_type: string,
  scope: string
}

interface IOAuthService {
  urlAuthorization() : string
  callback(code: string ) : void
}

class GithubService implements IOAuthService {
  client_id: string;
  client_secret: string;
  url_callback: string;

  
  constructor() {
    this.client_id = process.env.GITHUB_CLIENT_ID!
    this.client_secret = process.env.GITHUB_CLIENT_SECRET!
    this.url_callback = process.env.GITHUB_URI_CALLBACK!
  }
  
  urlAuthorization(): string {
    return `https://github.com/login/oauth/authorize?client_id=${this.client_id}&redirect_uri=${this.url_callback}&scope=read:user,user:email`
  }
  
  async callback(code: string): Promise<IGithubCallback> {

    const body = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      code
    }

    const { data } = await axios.post(`https://github.com/login/oauth/access_token`, body, {
      headers: {
        accept: 'application/json'
      }
    })
    return data
  }
  
}

export default new GithubService();