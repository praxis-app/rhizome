import { IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsOptional()
  body: string;

  @IsString()
  channelId: string;
}
