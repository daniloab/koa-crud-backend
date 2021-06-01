import {
  clearDbAndRestartCounters,
  connectMongoose,
  createDeleteApiCall,
  defaultFrozenKeys,
  disconnectMongoose,
  sanitizeTestObject,
} from "../../../../test";
import { createUser } from "../../../modules/user/fixtures/createUser";
import { base64 } from "../../../auth/base64";

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const getUrl = (id: string) => `/api/user/${id}`;

it("should return error if authorization header does not exist", async () => {
  const response = await createDeleteApiCall({
    url: getUrl("123"),
  });

  expect(response.status).toBe(401);
  expect(response.body.message).toBe("Unauthorized");
  expect(response.body).toMatchSnapshot();
});

it("should return error if id it is not valid", async () => {
  const admin = await createUser({});
  const authorization = base64(`${admin._id}`);
  const response = await createDeleteApiCall({
    url: getUrl("123"),
    authorization,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("User not found");
  expect(response.body).toMatchSnapshot();
});

it("should return error if user it was not found", async () => {
  const admin = await createUser({});
  const authorization = base64(`${admin._id}`);

  const response = await createDeleteApiCall({
    url: getUrl("5c42132aa591a2001ad46264"),
    authorization,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("User not found");
  expect(response.body).toMatchSnapshot();
});

it("should delete an user", async () => {
  const admin = await createUser({});
  const authorization = base64(`${admin._id}`);
  const user = await createUser({});

  const response = await createDeleteApiCall({
    url: getUrl(user._id),
    authorization,
  });

  expect(response.status).toBe(200);
  expect(response.body.user.name).toBe(user.name);
  expect(response.body.user.email).toBe(user.email);
  expect(response.body.user.removedAt).toBeDefined();
  expect(
    sanitizeTestObject(response.body, [...defaultFrozenKeys, "removedAt"])
  ).toMatchSnapshot();
});

it("should return user not found for a user already deleted", async () => {
  const admin = await createUser({});
  const authorization = base64(`${admin._id}`);
  const user = await createUser({
    removedAt: new Date(),
  });

  const response = await createDeleteApiCall({
    url: getUrl(user._id),
    authorization,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("User not found");
  expect(sanitizeTestObject(response.body)).toMatchSnapshot();
});
