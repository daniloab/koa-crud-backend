import User from "../../modules/user/UserModel";
import { userSelection } from "./userGet";
import { getPageInfo, getSkipAndLimit } from "../apiHelpers";

export const userGetAll = async (ctx) => {
  const { skip, limit } = getSkipAndLimit(ctx);
  try {
    const users = await User.find({
      removedAt: null,
    })
      .skip(skip)
      .limit(limit)
      .select(userSelection)
      .lean();

    const pageInfo = await getPageInfo(ctx, User);

    if (pageInfo.errors) {
      ctx.status = 422;
      ctx.body = {
        errors: pageInfo.errors,
      };

      return;
    }

    ctx.status = 200;
    ctx.body = {
      pageInfo,
      users,
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
