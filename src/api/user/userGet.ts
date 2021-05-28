import User from "../../modules/user/UserModel";
import { getObjectId } from "../../../test";
export const userSelection = {
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

const getConditions = (id?: string, email?: string) => {
  if (id) {
    return {
      error: null,
      conditions: {
        _id: getObjectId(id),
      },
    };
  }

  if (email) {
    return {
      error: null,
      conditions: {
        email,
      },
    };
  }

  return {
    error: "Invalid user",
  };
};

export const getUserApi = async (
  id?: string,
  email?: string
): Promise<GetUserApiPayload> => {
  const { conditions, error } = getConditions(id, email);

  if (error) {
    return {
      error,
      user: null,
    };
  }

  const user = await User.findOne({
    ...conditions,
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
