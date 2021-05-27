import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  createGetApiCall,
} from "../../../../test";
import { createUser } from "../../../modules/user/fixtures/createUser";

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const getUrl = (id: string) => `/api/user/${id}`;

it("should return error if user it was not found", async () => {
  const response = await createGetApiCall({
    url: getUrl("5c42132aa591a2001ad46264"),
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("User not found");
  expect(response.body).toMatchSnapshot();
});

it("should return user by id", async () => {
  const user = await createUser({});
  const response = await createGetApiCall({
    url: getUrl(user._id),
  });

  expect(response.status).toBe(200);
  expect(response.body.user.name).toBe(user.name);
  expect(response.body.user.email).toBe(user.email);
  expect(response.body).toMatchSnapshot();
});
