import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    recycleBinPinHash: {
      type: String,
      select: false,
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.setRecycleBinPin = async function setRecycleBinPin(pin) {
  this.recycleBinPinHash = await bcrypt.hash(pin, 12);
};

userSchema.methods.verifyRecycleBinPin = function verifyRecycleBinPin(pin) {
  if (!this.recycleBinPinHash) return false;
  return bcrypt.compare(pin, this.recycleBinPinHash);
};

export default mongoose.model('User', userSchema);
