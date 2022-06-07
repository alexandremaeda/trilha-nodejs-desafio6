import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to authenticate an user", async () => {
    const newUser = {
      name: "Alexandre",
      email: "email@email.com",
      password: "123456",
    };

    await createUserUseCase.execute(newUser);

    const authenticateUserInfo = await authenticateUserUseCase.execute({
      email: newUser.email,
      password: newUser.password,
    });

    expect(authenticateUserInfo).toHaveProperty("token");
  });

  it("should not be able to authenticate an noneexistent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@jest.com",
        password: "null",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate an user with wrong password", async () => {
    expect(async () => {
      const newUser = {
        name: "Alexandre",
        email: "email@email.com",
        password: "123456",
      };

      await createUserUseCase.execute(newUser);

      await authenticateUserUseCase.execute({
        email: newUser.email,
        password: "wrongPassWord",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
