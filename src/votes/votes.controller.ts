import { Request, Response } from 'express';
import * as votesService from './votes.service';

export const createVote = async (req: Request, res: Response) => {
  const vote = await votesService.createVote(req.body, res.locals.user.id);
  res.json({ vote });
};

export const updateVote = async (req: Request, res: Response) => {
  const result = await votesService.updateVote(req.params.voteId, req.body);
  res.json(result);
};

export const deleteVote = async (req: Request, res: Response) => {
  const result = await votesService.deleteVote(req.params.voteId);
  res.json(result);
};
