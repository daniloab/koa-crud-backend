import { checkObjectId } from "../apiHelpers";
import User from "../../modules/user/UserModel";
import { getUserApi } from "./userGet";

export const userDelete = async (ctx) => {
  const { id } = ctx.params;

  const _id = checkObjectId(id);

  if (!_id) {
    ctx.status = 400;
    ctx.body = {
      message: "User not found",
    };
    return;
  }

  const user = await User.findOne({
    _id,
    removedAt: null,
  });

  if (!user) {
    ctx.status = 400;
    ctx.body = {
      message: "User not found",
    };
    return;
  }

  try {
    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          removedAt: new Date(),
        },
      }
    );

    const { user: userUpdated, error } = await getUserApi(user._id);

    if (error) {
      ctx.status = 400;
      ctx.body = {
        message: "Error while deleting user",
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      user: userUpdated,
    };
  } catch (err) {
    // eslint-disable-next-line
    console.log("err: ", err);

    ctx.status = 500;
    ctx.body = {
      message: "Unknown error",
    };
  }
};
