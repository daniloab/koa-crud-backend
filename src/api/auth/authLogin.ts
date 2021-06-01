import User from "../../modules/user/UserModel";
import { generateToken } from "../../auth/generateToken";

export const authLogin = async (ctx) => {
  const { email, password } = ctx.request.body;

  if (!email || !password) {
    ctx.status = 401;
    ctx.body = {
      message: "Email or password incorrect",
    };
    return;
  }

  const user = await User.findOne({
    email,
    removedAt: null,
  });

  if (!user) {
    ctx.status = 401;
    ctx.body = {
      message: "Email or password incorrect",
    };
    return;
  }

  let correctPassword;

  try {
    correctPassword = user.authenticate(password);
  } catch {
    ctx.status = 401;
    ctx.body = {
      message: "Email or password incorrect",
    };
    return;
  }

  if (!correctPassword) {
    ctx.status = 401;
    ctx.body = {
      message: "Email or password incorrect",
    };
    return;
  }

  ctx.status = 200;
  ctx.body = {
    message: "User authenticated with success",
    token: generateToken(user),
  };
};
