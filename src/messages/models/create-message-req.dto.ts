import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMessageReq {
  @IsString()
  @IsOptional()
  body: string;

  @IsString()
  channelId: string;

  @IsInt()
  imageCount: number;
}
