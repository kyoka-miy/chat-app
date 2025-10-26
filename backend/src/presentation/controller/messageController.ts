import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { catchAsync } from '../../middlewares/catchAsync';
import { ValidObjectId } from '../../validators/validObjectId';
import { ObjectId } from 'mongodb';
import { GetMessagesUseCase } from '../../usecase/message/getMessagesUseCase';

@autoInjectable()
export class MessageController {
  constructor(private getMessagesUsecase: GetMessagesUseCase) {}

  getMessages = catchAsync(async (req: Request, res: Response) => {
    const chatRoomId = new ObjectId(req.query.chatRoomId as string);
    const messages = await this.getMessagesUsecase.execute(chatRoomId);
    res.status(200).json(messages);
  });
}

export class GetMessagesDto {
  @ValidObjectId()
  chatRoomId!: ObjectId;
}
