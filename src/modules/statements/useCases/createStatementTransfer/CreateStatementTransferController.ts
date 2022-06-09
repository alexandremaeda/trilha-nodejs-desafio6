import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementTransferUseCase } from './CreateStatementTransferUseCase';

export class CreateStatementTransferController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;
    const { user_id } = request.params;

    const createStatementTransfer = container.resolve(
      CreateStatementTransferUseCase
    );

    const statement = await createStatementTransfer.execute({
      user_id,
      sender_id,
      amount,
      description,
    });

    return response.status(201).json(statement);
  }
}
