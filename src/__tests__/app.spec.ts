import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  createGetApiCall,
} from "../../test";

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const url = "/api/version";

it("should get api version correctly", async () => {
  const response = await createGetApiCall({ url });

  expect(response.body).toMatchSnapshot();
  expect(response.status).toBe(200);
});
