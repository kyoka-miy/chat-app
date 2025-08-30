import mongoose from "mongoose";

export interface IChatRoom extends Document {
  name: string;
  createdDateTime: Date;
  accounts: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
}

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Chat room name is required"],
  },
  createdDateTime: {
    type: Date,
    default: Date.now,
  },
  accounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

export const ChatRoom = mongoose.model<IChatRoom>("ChatRoom", chatRoomSchema);
