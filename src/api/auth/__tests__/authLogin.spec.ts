import {
  clearDbAndRestartCounters,
  connectMongoose,
  createApiCall,
  defaultFrozenKeys,
  disconnectMongoose,
  sanitizeTestObject,
} from "../../../../test";
import { createUser } from "../../../modules/user/fixtures/createUser";

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const url = "/api/auth/login";

it("should return error if login and password it was not passed", async () => {
  const response = await createApiCall({ url, payload: {} });

  expect(response.status).toBe(401);
  expect(response.body.message).toBe("Email or password incorrect");
  expect(response.body).toMatchSnapshot();
});

it("should return error if email it was not passed", async () => {
  const response = await createApiCall({
    url,
    payload: { password: "123456" },
  });

  expect(response.status).toBe(401);
  expect(response.body.message).toBe("Email or password incorrect");
  expect(response.body).toMatchSnapshot();
});

it("should return error if password it was not passed", async () => {
  const response = await createApiCall({
    url,
    payload: { email: "test@test.com" },
  });

  expect(response.status).toBe(401);
  expect(response.body.message).toBe("Email or password incorrect");
  expect(response.body).toMatchSnapshot();
});

it("should return error if user doest not exist", async () => {
  const response = await createApiCall({
    url,
    payload: { email: "test@test.com", password: "123456" },
  });

  expect(response.status).toBe(401);
  expect(response.body.message).toBe("Email or password incorrect");
  expect(response.body).toMatchSnapshot();
});

it("should return user not found if user is already removed", async () => {
  const user = await createUser({
    removedAt: new Date(),
  });

  const response = await createApiCall({
    url,
    payload: { email: user.email, password: user.password },
  });

  expect(response.status).toBe(401);
  expect(response.body.message).toBe("Email or password incorrect");
  expect(response.body).toMatchSnapshot();
});

it("should return for wrong email", async () => {
  const user = await createUser({
    email: "agostinho@test.com",
    password: "123456taxi",
  });

  const response = await createApiCall({
    url,
    payload: { email: "agositnhoo@test.com", password: user.password },
  });

  expect(response.status).toBe(401);
  expect(response.body.message).toBe("Email or password incorrect");
  expect(response.body).toMatchSnapshot();
});

it("should return for wrong password", async () => {
  const user = await createUser({
    email: "agostinho@test.com",
    password: "123456taxi",
  });

  const response = await createApiCall({
    url,
    payload: { email: user.email, password: "taxi" },
  });

  expect(response.status).toBe(401);
  expect(response.body.message).toBe("Email or password incorrect");
  expect(response.body).toMatchSnapshot();
});

it("should return token for user email and password valid", async () => {
  const user = await createUser({
    email: "agostinho@test.com",
    password: "123456taxi",
  });

  const response = await createApiCall({
    url,
    payload: { email: user.email, password: "123456taxi" },
  });

  expect(response.status).toBe(200);
  expect(response.body.message).toBe("User authenticated with success");
  expect(response.body.token).toBeDefined();
  expect(
    sanitizeTestObject(response.body, [...defaultFrozenKeys, "token"])
  ).toMatchSnapshot();
});
