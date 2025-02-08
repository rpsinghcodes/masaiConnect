import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface locationSchema {
  city: string;
  state: string;
  country: string;
}

const locationSchema = new Schema({
  city: {
    type: String,
    default: null,
  },
  state: {
    type: String,
    default: null,
  },
  country: {
    type: String,
    default: null,
  },
});

interface preferenceSchema {
  theme: string;
  language: string;
}

const preferenceSchema = new Schema({
  theme: {
    type: String,
    default: null,
  },
  language: {
    type: String,
    default: null,
  },
});

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide your password'],
    },
    phoneNumber: [
      {
        type: Number,
        required: [true, 'Please provide your phone number'],
      },
    ],
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'student', 'mentor', 'admin', 'superAdmin'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'verified', 'banned'],
    },
    location: locationSchema,
    preference: preferenceSchema,
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

UserSchema.pre<UserInterface>('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(user.password, salt);
  next();
});

UserSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};
UserSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      status: this.status,
    },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS as string) },
  );
};
UserSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      status: this.status,
    },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES as string) },
  );
};
interface UserInterface {
  name: string;
  email: string;
  password: string;
  phoneNumber: number[];
  avatar: string;
  role: string;
  isActive: boolean;
  status: string;
  location: locationSchema;
  preference: preferenceSchema;
  refreshToken: string;
  isModified: (field: string) => boolean;
  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateRefreshToken: () => Promise<string>;
  generateAccessToken: () => Promise<string>;
}

const User = mongoose.model<UserInterface>('User', UserSchema);

export default User;
export { UserInterface };
