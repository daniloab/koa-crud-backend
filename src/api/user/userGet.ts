import User from "../../modules/user/UserModel";
import { getObjectId } from "../../../test";
const userSelection = {
  _id: 1,
  name: 1,
  email: 1,
};

type UserPayload = {
  _id: string;
  name: string;
  email: string;
};

type GetUserApiPayload = {
  error: string | null;
  user: UserPayload | null;
};

export const getUserApi = async (id: string): Promise<GetUserApiPayload> => {
  const user = await User.findOne({
    _id: getObjectId(id),
  })
    .select(userSelection)
    .lean();

  if (!user) {
    return {
      error: "User not found",
      user: null,
    };
  }

  return {
    error: null,
    user,
  };
};

export const userGet = async (ctx) => {
  const { id } = ctx.params;

  try {
    if (!id) {
      ctx.status = 400;
      ctx.body = {
        message: "You must provide an id",
      };
      return;
    }

    const { user, error } = await getUserApi(id);

    if (error) {
      ctx.status = 400;
      ctx.body = {
        message: error,
      };
      return;
    }
    ctx.status = 200;
    ctx.body = {
      user,
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
