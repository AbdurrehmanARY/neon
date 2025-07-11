import z from 'zod';
export interface user {
  userName: string;
  email: string;
  password?: string;
  role: string;
}
export const userRoleEnum = z.enum(['admin', 'user']);

export const userSchema = z.object({
  userName: z.string().min(1, { message: 'user cannot be empty' }),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .min(1, { message: 'email cannot be empty' })
    .email(),
  password: z
    .string({
      required_error: 'password is required',
    })
    .min(6, { message: 'password will atleast 6 character' }),
  avatar: z.string().min(1, { message: 'please enter avatar' }),
  // role: userRoleEnum.default('user').optional(),
});

const paylaodSchema = z.object({
  userID: z.string().min(1, { message: 'id cannot be empty' }),
  role: userRoleEnum.default('user'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'password will contain atleast 6 character' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'confirm password cannot be empty' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'password does not match',
  });

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .min(1, { message: 'email cannot be empty' })
    .email(),
  password: z
    .string({
      required_error: 'password is required',
    })
    .min(6, { message: 'password will atleast 6 character' }),
});

export const forgotPasswordSchema = z
  .string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  })
  .min(1, { message: 'email cannot be empty' })
  .email();
export type UserDto = z.infer<typeof userSchema>;
export type loginDto = z.infer<typeof loginSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

export type payloadModel = z.infer<typeof paylaodSchema>;
export type ResetPasswordModel = z.infer<typeof resetPasswordSchema>;
