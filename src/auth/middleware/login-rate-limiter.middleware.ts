import { Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import { dataSource } from '../../database/data-source';
import { User } from '../../users/user.entity';
import { normalizeText } from '../../common/common.utils';

const handleLoginRateLimit = async (req: Request, res: Response) => {
  console.log('Login rate limit exceeded');

  const userRepository = dataSource.getRepository(User);
  const { email } = req.body;

  const normalizedEmail = normalizeText(email);
  const user = await userRepository.findOne({
    where: { email: normalizedEmail },
  });

  if (user && !user.locked) {
    await userRepository.update(user.id, { locked: true });
    console.log(`Locked user account: ${user.id}`);
  }

  res.status(429).send('Incorrect username or password');
};

export const loginRateLimiter = rateLimit({
  handler: handleLoginRateLimit,
  windowMs: 60 * 1000 * 10,
  limit: 5,
});
