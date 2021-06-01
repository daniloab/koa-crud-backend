import { getCounter } from "../../../../test";

import User from "../UserModel";

export const createUser = async (args) => {
  const n = getCounter("user");
  const {
    name = `User ${n}`,
    email = `user${n}@test.com`,
    password = `password123${n}321`,
    ...payload
  } = args;

  return await new User({
    name,
    email,
    password,
    ...payload,
  }).save();
};
