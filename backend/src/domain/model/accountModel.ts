import mongoose from 'mongoose';
import validator from 'validator';

export interface IAccount extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  name: string;
  email: string;
  createdAt: Date;
  chatRooms: mongoose.Types.ObjectId[];
  friends: mongoose.Types.ObjectId[];
}

const accountSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  userId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  chatRooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom',
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
});

accountSchema.pre('save', function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }
  if (!this.userId) {
    this.userId = this._id.toString();
  }
  next();
});

export const Account = mongoose.model<IAccount>('Account', accountSchema);
