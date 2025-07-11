import { and, eq, gt } from 'drizzle-orm';
// import { db } from '../db';
// import { db } from '..';
import { db } from '../db';
import { InsertUser, SelectUser, userTable } from '../db/schema';
import { loginDto, payloadModel, UserDto } from '../dto/user.dto';
import {
  createAccessToken,
  expireToken,
  generateRandomToken,
  hashPassword,
  verifyPassword,
} from '../helper/auth.helper';
import { sendEmail } from '../utils/email';
import { CustomError } from '../utils/customError';
import { uploadOnCloudinary } from '../utils/cloudinary';

export default class AuthService {
  async register(data: UserDto): Promise<any> {
    try {
      let { userName, email, password, avatar } = data;

      const obj = await uploadOnCloudinary(data.avatar);
      if (!obj) {
        throw new CustomError('error with cloudinary', 400);
      }

      avatar = obj?.secure_url;
      const hashedPassword = await hashPassword(password, 10);
      const emailVarificationToken = generateRandomToken();
      const emailVarificationTokenExpire: Date = expireToken();
      const isEmailVerified = false;

      if (!isEmailVerified) {
        await sendEmail(
          email,
          emailVarificationToken,
          emailVarificationTokenExpire,
        );
      }
      const user = await db.insert(userTable).values({
        userName,
        email,
        password: hashedPassword,
        avatar,
        role: 'user',
        isEmailVerified,
        emailVarificationToken,
        emailVarificationTokenExpire,
      });
      return user;
    } catch (err) {
      console.log(err);
      const error = new CustomError(
        'error while inserting data in database',
        400,
      );
      throw error;
    }
  }
  async login(data: loginDto): Promise<string> {
    const { email, password } = data;
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new CustomError('email already exist', 401);
    }

    const pass = await verifyPassword(password, user.password);
    if (!pass) {
      throw new CustomError('password is incorrect ', 401);
    }

    const payload: payloadModel = {
      userID: user.id,
      role: user.role,
    };
    const token = createAccessToken(payload);
    return token;
  }
  async forgotPassword(email: string): Promise<boolean | undefined> {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new CustomError('user not found', 500);
      }
      const resetToken = generateRandomToken();
      const expireDate: Date = expireToken();

      await db
        .update(userTable)
        .set({
          passwordResetToken: resetToken,
          passwordResetTokenExpires: expireDate,
        })
        .where(eq(userTable.id, user.id))
        .returning();

      const acceptedData = await sendEmail(email, resetToken, expireDate);
      if (!acceptedData) {
        throw new CustomError(
          'error while sending email in forgot password',
          500,
        );
      }

      const accepted = acceptedData?.accepted.includes(email);
      return accepted;
    } catch (e) {
      console.log(e);
    }
  }
  async resetPassword(token: string, password: string): Promise<void> {
    try {
      const checkUser = await db.query.userTable.findFirst({
        where: and(
          eq(userTable.passwordResetToken, token),
          gt(userTable.passwordResetTokenExpires, new Date()),
        ),
      });
      if (!checkUser) {
        throw new CustomError('token is invalid or expire', 500);
      }
      const hashedPassword = await hashPassword(password, 10);

      const user = await db
        .update(userTable)
        .set({
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetTokenExpires: null,
        })
        .where(eq(userTable.passwordResetToken, token));

      if (user) {
        throw new CustomError(
          'error while updating password in reset password',
          500,
        );
      }
    } catch (e) {
      console.log(e);
      throw new CustomError('some error occur in reset password', 500);
    }
  }

  async findUserByEmail(email: string): Promise<SelectUser | undefined> {
    try {
      return await db.query.userTable.findFirst({
        where: eq(userTable.email, email),
      });
    } catch (e) {
      console.log(e);
    }
  }
  async verifyEmail(token: string) {
    const checkUser = await db.query.userTable.findFirst({
      where: eq(userTable.passwordResetToken, token),
    });
    if (!checkUser) {
      throw new CustomError('token is invalid or expire', 404);
    }

    const user = await db
      .update(userTable)
      .set({
        emailVarificationToken: null,
        emailVarificationTokenExpire: null,
        isEmailVerified: true,
      })
      .where(eq(userTable.emailVarificationToken, token));
    if (!user) new CustomError('error while updating', 500);
  }

  async findUserById(id: string) {
    return await db.query.userTable.findFirst({
      where: eq(userTable.id, id),
      columns: {
        id: true,
        userName: true,
        email: true,
        password: true,
        role: true,
      },
    });
  }
}
