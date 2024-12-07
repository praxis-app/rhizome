import {
  Body,
  JsonController,
  Post,
  Res,
  UseBefore,
} from 'routing-controllers';
import { authService } from './auth.service';

@JsonController('/auth')
@UseBefore(authService.authenticateUser)
export class AuthController {
  @Post('/')
  @UseBefore(authService.validateUserRegistration)
  async post(@Body() body: { clientId: string }, @Res() res: any) {
    try {
      const token = await authService.register(body.clientId);
      return res.json({ token });
    } catch (e: any) {
      return res.status(500).send(e.message);
    }
  }
}
