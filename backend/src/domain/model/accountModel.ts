import mongoose from 'mongoose';
import validator from 'validator';

export interface IAccount extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  name: string;
  email: string;
  createdAt: Date;
  chatRooms: mongoose.Types.ObjectId[];
  friends: IAccount[];
}

const accountSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  userId: {
    type: String,
    unique: true,
    required: true,
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

export const Account = mongoose.model<IAccount>('Account', accountSchema);
