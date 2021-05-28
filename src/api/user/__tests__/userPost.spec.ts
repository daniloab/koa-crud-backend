import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  createApiCall,
  sanitizeTestObject,
} from "../../../../test";
import { createUser } from "../../../modules/user/fixtures/createUser";

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const url = "/api/user";

it("should return error if user it was not passed", async () => {
  const response = await createApiCall({ url, payload: {} });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("User is required");
  expect(response.body).toMatchSnapshot();
});

it("should return error if user name it was not passed", async () => {
  const user = { email: "test@test.com", password: "123456" };
  const response = await createApiCall({ url, payload: { user } });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("name is a required field");
  expect(response.body).toMatchSnapshot();
});

it("should return error if user email it was not passed", async () => {
  const user = { name: "obi wan kenobi", password: "123456" };
  const response = await createApiCall({ url, payload: { user } });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("email is a required field");
  expect(response.body).toMatchSnapshot();
});

it("should return error if user password it was not passed", async () => {
  const user = { name: "obi wan kenobi", email: "test@test.com" };
  const response = await createApiCall({ url, payload: { user } });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("password is a required field");
  expect(response.body).toMatchSnapshot();
});

it("should create user with success", async () => {
  const user = {
    name: "obi wan kenobi",
    email: "test@test.com",
    password: "123456",
  };

  const response = await createApiCall({ url, payload: { user } });

  expect(response.status).toBe(200);
  expect(response.body.user.name).toBe(user.name);
  expect(response.body.user.email).toBe(user.email);
  expect(sanitizeTestObject(response.body)).toMatchSnapshot();
});

it("should return error is email is already in use", async () => {
  await createUser({
    name: "obi wan kenobi",
    email: "test@test.com",
    password: "123456",
  });

  const userB = {
    name: "jay prichett",
    email: "test@test.com",
    password: "654321",
  };

  const response = await createApiCall({ url, payload: { user: userB } });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Email already in use");
  expect(sanitizeTestObject(response.body)).toMatchSnapshot();
});
