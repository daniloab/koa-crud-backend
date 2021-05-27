import User from "../../modules/user/UserModel";
import { validateUserApi } from "./userUtils";

const userSelection = {
  _id: 1,
  name: 1,
  email: 1,
};

export const userPost = async (ctx) => {
  const { user = null } = ctx.request.body;

  if (!user) {
    ctx.status = 400;
    ctx.body = {
      message: "User is required",
    };
    return;
  }

  const { user: userValidated, error } = await validateUserApi(user);

  if (error) {
    ctx.status = 400;
    ctx.body = {
      message: error,
    };
    return;
  }

  try {
    const userNew = await new User({
      ...userValidated,
    }).save();

    const userNormalized = await User.findOne({
      _id: userNew._id,
    })
      .select(userSelection)
      .lean();

    ctx.status = 200;
    ctx.body = {
      user: userNormalized,
    };

    return;
  } catch (err) {
    // eslint-disable-next-line
    console.log("err: ", err);

    ctx.status = 500;
    ctx.body = {
      message: "Unknown error",
    };
  }
};
