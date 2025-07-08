import { and, eq, gt } from 'drizzle-orm';
// import { db } from '../db';
// import { db } from '..';
import { db } from '../db';
import { userTable } from '../db/schema';
import { user, UserModel } from '../dto/user.dto';
import { hashPassword } from '../helper/auth.helper';

export default class AuthService {
  async register(data: UserModel) {
    try {
      const user = await db.insert(userTable).values(data);
      return user;
    } catch (e) {
      console.log(e);
    }
  }
  async login() {
    console.log('login');
  }
  async forgotPassword(id: string, resetToken: string, resetTokenExpire: Date) {
    try {
      await db
        .update(userTable)
        .set({
          passwordResetToken: resetToken,
          passwordResetTokenExpires: resetTokenExpire,
        })
        .where(eq(userTable.id, id))
        .returning();

      // console.log('update', update);
    } catch (e) {
      console.log(e);
    }
  }
  async resetPassword(token: string, password: string) {
    try {
      const [checkUser] = await db
        .select({
          userName: userTable.userName,
          email: userTable.email,
          password: userTable.password,
          role: userTable.role,
        })
        .from(userTable)
        .where(
          and(
            eq(userTable.passwordResetToken, token),
            gt(userTable.passwordResetTokenExpires, new Date()),
          ),
        );
      console.log('checkUser', checkUser);
      if (!checkUser) {
        return null;
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
      return user;
    } catch (e) {
      console.log(e);
    }
  }

  async findUserByEmail(email: string) {
    return await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
      columns: {
        id: true,
        email: true,
        password: true,
        role: true,
        isEmailVerified: true,
      },
    });
  }
  async verifyEmail(token: string) {
    const [checkUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.emailVarificationToken, token));
    if (!checkUser) {
      return null;
    }
    const user = await db
      .update(userTable)
      .set({
        emailVarificationToken: null,
        emailVarificationTokenExpire: null,
        isEmailVerified: true,
      })
      .where(eq(userTable.emailVarificationToken, token));

    if (!user) {
      return null;
    }
    return user;
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
