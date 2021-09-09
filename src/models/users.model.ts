import db, {execPromise} from "../helpers/db"

export const getUserByEmail = (email: string) => {
  return execPromise('SELECT * from users where email = ? ', [email])
}

export const createUser = (data: object) => {
  return execPromise('INSERT into users set ?', [data])
}

export const updateUser = (data: object, id: number) => {
  return execPromise('UPDATE users set ? where id=?', [data, id])
}
