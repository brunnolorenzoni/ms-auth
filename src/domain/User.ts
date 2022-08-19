import { v4 as uuidv4 } from 'uuid';

interface UserProps {
  id?: string;
  email: string;
  password: string;
  roles: Array<number>;
}

export default class User {
  id: string;
  email: string;
  password: string;
  roles: Array<number>;
  refreshToken: string | null = null;

  constructor(props: UserProps){
    props.id ? 
      this.id = props.id
    : this.id = uuidv4()

    this.email = props.email
    this.password = props.password
    this.roles = props.roles
  }
}