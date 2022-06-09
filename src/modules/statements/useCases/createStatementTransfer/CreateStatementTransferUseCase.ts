import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { CreateStatementTransferError } from './CreateStatementTransferError';
import { ICreateStatementTransferDTO } from './ICreateStatementTransferDTO';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

@injectable()
export class CreateStatementTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    user_id,
    sender_id,
    amount,
    description,
  }: ICreateStatementTransferDTO) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateStatementTransferError.UserNotFound();
    }

    const send = await this.usersRepository.findById(sender_id);

    if (!send) {
      throw new CreateStatementTransferError.SenderNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    if (balance < amount) {
      throw new CreateStatementTransferError.InsufficientFunds();
    }

    const statementTransfer = await this.statementsRepository.transfer({
      user_id,
      sender_id,
      amount,
      description,
    });

    const statementOperation = await this.statementsRepository.create({
      user_id: sender_id,
      type: OperationType.WITHDRAW,
      amount,
      description,
    });

    return statementTransfer;
  }
}
