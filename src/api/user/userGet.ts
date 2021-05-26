export const userGet = (ctx) => {
  const { id } = ctx.params;

  try {
    if (!id) {
      ctx.status = 400;
      ctx.body = {
        message: "You must provide an id",
      };
      return;
    }

    // @todo api call
    const user = {
      _id: "5c42132aa591a2001ad46264",
      name: "abc",
      email: "test@test.com",
    };

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
      message: "Unknown erro",
    };
  }
};
