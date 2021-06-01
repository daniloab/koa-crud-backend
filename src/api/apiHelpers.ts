import { Model, Types } from "mongoose";
import { Context } from "koa";
import { getObjectId } from "../../test";

export const getSkipAndLimit = (ctx: Context) => {
  const { skip = 0, limit = 100 } = ctx.query;

  if (skip < 0 || limit < 0) {
    return {
      skip: null,
      limit: null,
      errors: [
        {
          data: { skip, limit },
          message: "Pagination values should be positive values",
        },
      ],
    };
  }

  const mongoLimit = Math.min(parseInt(limit, 10), 100);
  const mongoSkip = parseInt(skip, 10);

  return {
    skip: mongoSkip,
    limit: mongoLimit,
    errors: null,
  };
};

type ErrorValidate = {
  data: {};
  message: string;
};

type PageInfo = {
  errors?: ErrorValidate[];
  skip: number;
  limit: number;
  totalCount: number;
  hasPreviousPage: number;
  hasNextPage: number;
};

export const getPageInfo = async (ctx: Context, model: Model): PageInfo => {
  const { skip, limit, errors } = getSkipAndLimit(ctx);

  if (errors) {
    return {
      errors,
      skip,
      limit,
      totalCount: null,
      hasPreviousPage: null,
      hasNextPage: null,
    };
  }

  const conditionsTotalCount = {
    removedAt: null,
  };

  const totalCount = await model.count(conditionsTotalCount);

  const hasPreviousPage = skip > 0;
  const hasNextPage = skip + limit < totalCount;

  return {
    skip,
    limit,
    totalCount,
    hasPreviousPage,
    hasNextPage,
  };
};

export const checkObjectId = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  return getObjectId(id);
};
