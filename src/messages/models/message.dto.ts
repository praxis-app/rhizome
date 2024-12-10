import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  @IsOptional()
  body: string;

  @IsNumber()
  channelId: number;
}
