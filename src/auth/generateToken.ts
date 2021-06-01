import jwt from "jsonwebtoken";
import { IUser } from "../../modules/user/UserModel";

import { config } from "../config";

export const generateToken = (user: IUser) => {
  return `JWT ${jwt.sign({ user: user._id }, config.JWT_SECRET)}`;
};
