import { getCounter } from "../../../../test";

import User from "../UserModel";

export const createUser = async (args) => {
  const n = getCounter("donor");
  const {
    name = `User ${n}`,
    email = `user${n}@test.com`,
    password = `password123${n}321`,
  } = args;

  return await new User({
    name,
    email,
    password,
  }).save();
};
