export const userPost = (ctx) => {
  const body = ctx.request.body;

  // @todo implement body values validation with yup;

  try {
    // @todo create new user if valid
    const user = {
      _id: "5c42132aa591a2001ad46264",
      name: "abc created",
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
