import { Schema, Model, model, Types, Document, Query } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser {
  name: string;
  email: string;
  photo: string;
  role: "user" | "guide" | "lead-guide" | "admin";
  password?: string;
  passwordConfirm?: string;
  passwordChangeDate?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  active: boolean;
}

export interface IUserDoc extends IUser, Document {
  checkPassword: (candidatePassword: string) => Promise<boolean>;
  passwordChangedAfter: (JWTTimestap: number) => boolean;
  createPasswordResetToken: () => string;
}

export interface IUserModel extends Model<IUserDoc> {}

const UserSchemaFields: Record<keyof IUser, any> = {
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (confirm: string): boolean {
        return confirm === this.password;
      },
      message: "Passwords don`t match each other.",
    },
  },
  passwordChangeDate: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
};

const userSchema = new Schema<IUserDoc, IUserModel, IUserDoc>(UserSchemaFields);

userSchema.methods.checkPassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password!);
};

userSchema.methods.passwordChangedAfter = function (JWTTimestamp: number) {
  if (this.passwordChangeDate) {
    const changedTimestamp = this.passwordChangeDate.getTime() / 1000;
    return changedTimestamp > JWTTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.passwordResetToken = hashedResetToken;
  this.passwordResetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password!, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangeDate = new Date(Date.now() - 2000);
  next();
});

userSchema.pre<Query<IUserDoc, IUserDoc>>(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

export const userModel = model<IUserDoc>("User", userSchema);
