import {
  clearDbAndRestartCounters,
  connectMongoose,
  createGetApiCall,
  disconnectMongoose,
  sanitizeTestObject,
} from "../../../../test";
import { createUser } from "../../../modules/user/fixtures/createUser";

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const url = "/api/user";

it("should return a list of users", async () => {
  const user = await createUser({});
  const userB = await createUser({});

  const response = await createGetApiCall({
    url,
  });

  expect(response.status).toBe(200);
  expect(sanitizeTestObject(response.body)).toMatchSnapshot();
});

it("should return 100 users if no skip limit is not specific", async () => {
  for (const i of Array.from(Array(110).keys())) {
    await createUser({ name: `user#${i + 2}` });
  }

  const response = await createGetApiCall({
    url,
  });

  expect(response.status).toBe(200);
  expect(response.body.users.length).toBe(100);
  expect(sanitizeTestObject(response.body)).toMatchSnapshot();
});

it("should paginate skipping 90 users and limit 10", async () => {
  for (const i of Array.from(Array(110).keys())) {
    await createUser({ name: `user#${i + 2}` });
  }

  const response = await createGetApiCall({
    url: `${url}?skip=90&limit=10`,
  });

  expect(response.status).toBe(200);
  expect(response.body.users.length).toBe(10);
  expect(sanitizeTestObject(response.body)).toMatchSnapshot();
});
