import { v4 as uuidV4 } from "uuid";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { CreateStatementError } from "./CreateStatementError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new deposit", async () => {
    const newUser = {
      name: "Alexandre",
      email: "email@email.com",
      password: "123456",
    };

    const createdUser = await createUserUseCase.execute(newUser);

    const statementDTO: ICreateStatementDTO = {
      user_id: createdUser.id!,
      type: OperationType.DEPOSIT,
      amount: 12,
      description: "lorem ipsum",
    };

    const createdStatement = await createStatementUseCase.execute(statementDTO);

    expect(createdStatement).toHaveProperty("id");
  });

  it("should not be able to create a new deposit, noneexistent user", async () => {
    expect(async () => {
      const statementDTO: ICreateStatementDTO = {
        user_id: uuidV4(),
        type: OperationType.DEPOSIT,
        amount: 12,
        description: "lorem ipsum",
      };

      await createStatementUseCase.execute(statementDTO);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should be able to create a new withdraw", async () => {
    const newUser = {
      name: "Alexandre",
      email: "email@email.com",
      password: "123456",
    };

    const createdUser = await createUserUseCase.execute(newUser);

    const deposit: ICreateStatementDTO = {
      user_id: createdUser.id!,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "lorem ipsum",
    };

    await createStatementUseCase.execute(deposit);

    const withdraw: ICreateStatementDTO = {
      user_id: createdUser.id!,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "lorem ipsum",
    };

    const createdStatementWithdraw = await createStatementUseCase.execute(
      withdraw
    );

    expect(createdStatementWithdraw).toHaveProperty("id");
  });

  it("should not be able to create a new withdraw, insufficient funds", async () => {
    expect(async () => {
      const newUser = {
        name: "Alexandre",
        email: "email@email.com",
        password: "123456",
      };

      const createdUser = await createUserUseCase.execute(newUser);

      const deposit: ICreateStatementDTO = {
        user_id: createdUser.id!,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "lorem ipsum",
      };

      await createStatementUseCase.execute(deposit);

      const withdraw: ICreateStatementDTO = {
        user_id: createdUser.id!,
        type: OperationType.WITHDRAW,
        amount: 110,
        description: "lorem ipsum",
      };

      await createStatementUseCase.execute(withdraw);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
