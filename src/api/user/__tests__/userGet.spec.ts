import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  createGetApiCall,
  sanitizeTestObject,
} from "../../../../test";
import { createUser } from "../../../modules/user/fixtures/createUser";
import { base64 } from "../../../auth/base64";

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const getUrl = (id: string) => `/api/user/${id}`;

it("should return error if authorization header does not exist", async () => {
  const response = await createGetApiCall({
    url: getUrl("5c42132aa591a2001ad46264"),
  });

  expect(response.status).toBe(401);
  expect(response.body.message).toBe("Unauthorized");
  expect(response.body).toMatchSnapshot();
});

it("should return error if user it was not found", async () => {
  const admin = await createUser({});
  const authorization = base64(`${admin._id}`);

  const response = await createGetApiCall({
    url: getUrl("5c42132aa591a2001ad46264"),
    authorization,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("User not found");
  expect(response.body).toMatchSnapshot();
});

it("should return user by id", async () => {
  const admin = await createUser({});
  const authorization = base64(`${admin._id}`);
  const user = await createUser({});
  const response = await createGetApiCall({
    url: getUrl(user._id),
    authorization,
  });

  expect(response.status).toBe(200);
  expect(response.body.user.name).toBe(user.name);
  expect(response.body.user.email).toBe(user.email);
  expect(sanitizeTestObject(response.body)).toMatchSnapshot();
});
