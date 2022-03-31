import { User } from "../../modules";

export const authForgotPassword = async (ctx) => {
  const user = await User.findOne({
    email: ctx.query.user.trim(),
  });

  ctx.status = 200;

  if (!user) {
    ctx.body = {
      message: "User not found",
    };

    return;
  }

  ctx.body = {
    user,
    password: "123",
  };

  return;
};
