import db, { execPromise } from "../helpers/db"

export const createForgotData = (code: string, id:number) => {
  return execPromise('INSERT into forgot_request set ? ', [{code, user_id: id}])
}

export const getResetUserCode = (code: string) => {
  return execPromise('SELECT u.id, u.email, r.code from forgot_request r LEFT JOIN users u ON r.user_id = u.id where r.code = ? ', [code]);
}

export const deleteResetUserCode = (code: string) => {
  return execPromise('DELETE from forgot_request where code = ? ', [code]);
}