import { NextFunction, Request, Response } from 'express';
import AuthService from './../services/auth.service';
import multer from 'multer';
import {
  ForgotPasswordDto,
  forgotPasswordSchema,
  resetPasswordSchema,
  userSchema,
} from '../dto/user.dto';
import { asyncHandler } from '../utils/asyncHandler';
import { uploadOnCloudinary } from '../utils/cloudinary';
const authService = new AuthService();

export class Auth {
  register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const avatar: string | undefined = req.file?.path;
      // if (!filePath) {
      //   return res.json({
      //     message: 'avatar is required',
      //   });
      // }
      const result = userSchema.safeParse({ ...req.body, avatar });
      console.log(result.data);
      if (!result.success) {
        res.status(400).json({
          message: result?.error?.errors[0].message,
        });
        return;
      }
      const { email } = result.data;
      const checkEmail = await authService.findUserByEmail(email);
      if (checkEmail) {
        return res.status(409).json({
          message: 'user already register',
        });
      }
      await authService.register(result.data);

      return res.status(200).json({
        message:
          'registeration successfully. please check your email to verify your account',
      });
    },
  );

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: result?.error?.errors[0].message,
      });
      return;
    }
    const token = authService.login(result.data);

    return res.status(200).json({
      message: 'login successfully',
      token,
    });
  });

  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params;
    if (!token) {
      res.status(400).json({
        message: 'token not found',
      });
    }
    await authService.verifyEmail(token);

    res.status(200).json({
      message: 'Email is verified successfully',
    });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = forgotPasswordSchema.safeParse(req.body.email);

    if (!result.success) {
      return res.status(400).json({
        message: result?.error?.errors[0].message,
      });
    }
    const email: ForgotPasswordDto = result.data;
    const accepted = await authService.forgotPassword(email);

    if (!accepted) {
      res.json({
        message: 'email does not send to you',
      });
    }

    res.json({
      message: 'reset token is successfully send to you email',
      // messageId: acceptedData?.messageId,
    });
    return;
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params;
    const result = resetPasswordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: result?.error?.errors[0].message,
      });
    }
    const confirmPassword: string = result.data.confirmPassword;

    await authService.resetPassword(token, confirmPassword);

    res.json({
      message: 'reset password successfully',
    });
    return;
  });

  // async logout(req: Request, res: Response) {
  //   try {
  //     res
  //       .clearCookie('token', {
  //         httpOnly: true,
  //         sameSite: 'lax',
  //         secure: true,
  //       })
  //       .json({
  //         message: 'logout successfully',
  //       });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
}

// export const register = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // console.log(req.body);
//     // console.log(req.file?.path);
//     console.log(typeof req.file?.path);

//     const filePath: string | undefined = req.file?.path;
//     if (!filePath) {
//       return res.json({
//         message: 'avatar is required',
//       });
//     }
//     const obj = await uploadOnCloudinary(filePath);
//     const avatar = obj?.secure_url;

//     const result = userSchema.safeParse({ ...req.body, avatar });

//     if (!result.success) {
//       res.status(400).json({
//         message: result?.error?.errors[0].message,
//       });
//       return;
//     }
//     const { email } = result.data;
//     const checkEmail = await authService.findUserByEmail(email);
//     if (checkEmail) {
//       return res.status(409).json({
//         message: 'user already register',
//       });
//     }
//     await authService.register(result.data);

//     return res.status(200).json({
//       message:
//         'registeration successfully. please check your email to verify your account',
//     });
//   },
// );

// verfy email code

// export const varifyEmail = asyncHandler(async (req: Request, res: Response) => {
//   const { token } = req.params;
//   if (!token) {
//     res.status(400).json({
//       message: 'token not found',
//     });
//   }
//   await authService.verifyEmail(token);

//   res.status(200).json({
//     message: 'Email is verified successfully',
//   });
// });

// export const login = asyncHandler(async (req: Request, res: Response) => {
//   const result = userSchema.safeParse(req.body);
//   if (!result.success) {
//     res.status(400).json({
//       message: result?.error?.errors[0].message,
//     });
//     return;
//   }
//   const token = authService.login(result.data);

//   return res.status(200).json({
//     message: 'login successfully',
//     token,
//   });
// });

// export const forgotPassword = asyncHandler(
//   async (req: Request, res: Response) => {
//     const result = forgotPasswordSchema.safeParse(req.body.email);

//     if (!result.success) {
//       return res.status(400).json({
//         message: result?.error?.errors[0].message,
//       });
//     }
//     const email: ForgotPasswordDto = result.data;
//     const accepted = await authService.forgotPassword(email);

//     if (!accepted) {
//       res.json({
//         message: 'email does not send to you',
//       });
//     }

//     res.json({
//       message: 'reset token is successfully send to you email',
//       // messageId: acceptedData?.messageId,
//     });
//     return;
//   },
// );

// export const resetPassword = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { token } = req.params;
//     const result = resetPasswordSchema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({
//         message: result?.error?.errors[0].message,
//       });
//     }
//     const confirmPassword: string = result.data.confirmPassword;

//     await authService.resetPassword(token, confirmPassword);

//     res.json({
//       message: 'reset password successfully',
//     });
//     return;
//   },
// );

// export const logout = (req: Request, res: Response) => {
//   try {
//     res
//       .clearCookie('token', {
//         httpOnly: true,
//         sameSite: 'lax',
//         secure: true,
//       })
//       .json({
//         message: 'logout successfully',
//       });
//   } catch (e) {
//     console.log(e);
//   }
// };
