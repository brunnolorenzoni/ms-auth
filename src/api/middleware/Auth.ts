import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../helpers/ApiError'
import axios from 'axios'

const check = (accessToken: string, jwt: string) => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:3000/api/v1/auth/verify', {
      headers: {
        Cookie: `jwt=${jwt}`,
        Authorization: accessToken
      }
    }).then(response => {
      resolve(true);
    })
    .catch(function (error) {
      reject(error.response.data.message);
    });
  })
}

export default (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers?.authorization?.toString() || req.headers?.Authorization?.toString() || ''
  if(!accessToken) throw new UnauthorizedError('Access token is missing')
  
  const jwt = req.cookies?.jwt?.toString() || ''
  if(!jwt) throw new UnauthorizedError('Refresh token is missing')

  check(accessToken, jwt).then(() => {
    next();
  }).catch((error) => {
    throw  new UnauthorizedError(error)
  })
}