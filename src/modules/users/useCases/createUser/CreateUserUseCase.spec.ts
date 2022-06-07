import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const createdUser = await createUserUseCase.execute({
      name: "Alexandre",
      email: "email@email.com",
      password: "123456",
    });

    expect(createdUser).toHaveProperty("id");
  });

  it("should not be able to create a new user with same email", async () => {
    expect(async () => {
      const newUser = {
        name: "Alexandre",
        email: "email@email.com",
        password: "123456",
      };

      await createUserUseCase.execute(newUser);
      await createUserUseCase.execute(newUser);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
