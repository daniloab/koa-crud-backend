import { Base64String, unbase64 } from "./base64";
import { getObjectId } from "../../test";
import User from "../modules/user/UserModel";

export type Token = {
  userId: string | null;
};

export const getToken = (authorization: Base64String): Token => {
  const userId = unbase64(authorization);

  if (!userId) {
    return {
      userId: null,
    };
  }

  return {
    userId,
  };
};

export const getUser = async (token: string) => {
  const { userId } = getToken(token);

  if (!userId) {
    return null;
  }

  const user = await User.findOne({
    _id: getObjectId(userId),
    removedAt: null,
  });

  return user;
};

export const auth = async (ctx, next) => {
  const { authorization } = ctx.header;

  if (!authorization) {
    ctx.status = 401;
    ctx.body = {
      message: "Unauthorized",
    };
    return;
  }

  const user = await getUser(authorization);

  if (!user) {
    ctx.status = 401;
    ctx.body = {
      message: "Unauthorized",
    };
    return;
  }

  ctx.user = user;

  await next();
};
