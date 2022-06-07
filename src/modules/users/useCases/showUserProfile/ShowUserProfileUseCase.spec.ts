import { v4 as uuidV4 } from "uuid";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to get an user", async () => {
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

    // Non-null assertion operator
    // const foundUser = await showUserProfileUseCase.execute(
    //   authenticateUserInfo.user.id!
    // );

    // nullish coalescing operator
    const foundUser = await showUserProfileUseCase.execute(
      authenticateUserInfo.user.id ?? ""
    );

    expect(foundUser).toHaveProperty("id");
  });

  it("should not be able to get an nonexistent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute(uuidV4());
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
