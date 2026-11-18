import bcrypt from 'bcrypt';
import { User, IUser, UserRole } from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';

export interface LoginResult {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export class AuthService {
  static async login(email: string, password: string): Promise<LoginResult> {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  static async getCurrentUser(userId: string): Promise<IUser | null> {
    return User.findById(userId).select('-password');
  }
}
