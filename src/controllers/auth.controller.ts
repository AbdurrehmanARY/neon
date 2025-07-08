import { Request, Response } from 'express';
import AuthService from './../services/auth.service';
import {
  payloadModel,
  resetPasswordSchema,
  UserModel,
  userSchema,
} from '../dto/user.dto';
import z from 'zod';
import {
  createAccessToken,
  expireToken,
  generateRandomToken,
  hashPassword,
  verifyPassword,
} from '../helper/auth.helper';
import crypto from 'crypto';
import { sendEmail } from '../utils/email';
const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: result?.error?.errors[0].message,
      });
      return;
    }

    const { userName, email, password } = result.data;
    const checkEmail = await authService.findUserByEmail(email);
    if (checkEmail) {
      res.status(409).json({
        message: 'user already register',
      });
      return;
    }
    const hashedPassword = await hashPassword(password, 10);
    const emailVarificationToken = generateRandomToken();
    const emailVarificationTokenExpire: Date = expireToken();
    const isEmailVerified = false;

    const data: UserModel = {
      userName,
      email,
      password: hashedPassword,
      role: 'user',
      isEmailVerified,
      emailVarificationToken,
      emailVarificationTokenExpire,
    };
    const user = await authService.register(data);
    if (!user) {
      res.json({ message: 'error while adding data in database' });
      return;
    }

    if (!isEmailVerified) {
      await sendEmail(
        email,
        emailVarificationToken,
        emailVarificationTokenExpire,
      );
    }

    res.status(200).json({
      message:
        'registeration successfully. please check your email to verify your account',
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    });
  }
};

// verfy email code
export const varifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (!token) {
      res.status(400).json({
        message: 'token not found',
      });
    }
    const user = await authService.verifyEmail(token);
    if (!user) {
      res.status(400).json({
        message: 'token is invalid or expire',
      });
    }
    res.status(200).json({
      message: 'Email is verified successfully',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: result?.error?.errors[0].message,
      });
      return;
    }
    const { email, password } = result.data;
    const user: UserModel | null | undefined =
      await authService.findUserByEmail(email);

    if (!user) {
      res.status(401).json({
        message: 'email not found',
      });
    }
    const pass = await verifyPassword(password, user?.password);
    if (!pass) {
      res.status(401).json({
        message: 'password is incorrect',
      });
    }
    const payload: payloadModel = {
      userID: user.id,
      role: user.role,
    };
    const token = createAccessToken(payload);
    res.status(200).cookie('token', token).json({
      message: 'login successfully',
      token,
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const result = z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .min(1, { message: 'email cannot be empty' })
      .email()
      .safeParse(req.body.email);

    if (!result.success) {
      res.status(400).json({
        message: result?.error?.errors[0].message,
      });
      return;
    }
    const email: string = result.data;
    const user = await authService.findUserByEmail(email);
    if (!user) {
      res.json({
        message: 'user not found',
      });
    }
    const resetToken = generateRandomToken();
    const expireDate: Date = expireToken();

    await authService.forgotPassword(user.id, resetToken, expireDate);

    const acceptedData = await sendEmail(email, resetToken, expireDate);
    const accepted = acceptedData?.accepted.includes(email);
    if (!accepted) {
      res.json({
        message: 'error while sending email to you',
      });
    }

    res.json({
      message: 'reset token is successfully send to you email',
      messageId: acceptedData?.messageId,
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const result = resetPasswordSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: result?.error?.errors[0].message,
      });
      return;
    }
    const { confirmPassword } = result.data;

    const checkToken = await authService.resetPassword(token, confirmPassword);

    if (!checkToken) {
      res.json({
        message: 'token is invalid or expired',
      });
      return;
    }
    res.json({
      message: 'reset password successfully',
    });
    return;
  } catch (e) {
    console.log(e);
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res
      .clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      })
      .json({
        message: 'logout successfully',
      });
  } catch (e) {
    console.log(e);
  }
};
