import mongoose from "mongoose";

export interface IMessage extends Document {
  text: string;
  sentDateTime: Date;
  isRead: boolean;
  sender: mongoose.Types.ObjectId;
  chatRoom: mongoose.Types.ObjectId;
}

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "message content is required"],
    },
    sentDateTime: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    chatRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRoom",
        required: true,
    }
});

export const Message = mongoose.model<IMessage>("Message", messageSchema);