import { Request, Response } from "express";
import { createUser, getUserByEmail, updateUser } from "../models/users.model";
import { createForgotData, deleteResetUserCode, getResetUserCode } from "../models/forgotPassword.model";
import { customAlphabet } from "nanoid";

const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

export const login = async (req:Request, res:Response) => {
  const {email, password} = req.body;
  const results = await getUserByEmail(email);
  if (results.length < 1) {
    return res.json({
      success: false,
      message: "User not found!"
    })
  } else {
    try {
      const user = results[0];
      const compare = await argon2.verify(user.password, password);
      const token = jwt.sign({ email, password }, process.env.APP_SECRET_KEY, { expiresIn: '1h' });
      
      if(compare) {
        return res.json({
          success: true,
          message: "Login is successfully!",
          results: token
        })
      } else {
        return res.json({
          success: false,
          message: "Password doesn't match!"
        })
      }
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: "An error occured!",
        results: error
      })
    }
  }
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const checkEmail = await getUserByEmail(email);
  if (checkEmail.length > 0 ) {
    return res.json({
      success: false,
      message: "Register Failed: Email already exist!"
    })
  } else {
    try {
      const hashPassword = await argon2.hash(password);
      const results = await createUser({ name, email, password: hashPassword });
      console.log("data: ", results);

      return res.json({
        success: true,
        message: "Register is successfully!"
      })
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: "An error occured!",
        results: error
      })
    }
    
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  const {email} = req.body;
  const checkEmail = await getUserByEmail(email);
  if (checkEmail.length > 0) {
    const user = checkEmail[0];
    const code = customAlphabet('0123456789', 4);
    const createRequest = await createForgotData(await code(), user.id);
    return res.json({
      success: true,
      message: "Request has been sent to email!"
    })
  } else {
    return res.json({
      success: false,
      message: "Email not found!"
    })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const {email, reset_code, new_password, confirm_password} = req.body;
  const [user] = await getResetUserCode(reset_code);
  if (user) {
    if (user.email !== email) {
      return res.json({
        success: false,
        message: "Wrong email or reset code!"
      })
    }
    if (new_password !== confirm_password) {
      return res.json({
        success: false,
        message: "Password doesn't match!"
      })
    }
    const newPassword = await argon2.hash(new_password);
    await updateUser({password: newPassword}, user.id);
    await deleteResetUserCode(reset_code);
    return res.json({
      success: true,
      message: "Your password has been reset!"
    })
  } else {
    return res.json({
      success: false,
      message: "Error reset password!"
    })
  }
}