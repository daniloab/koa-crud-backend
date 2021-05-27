import * as yup from "yup";

type ApiUser = {
  name: string;
  email: string;
  password: string;
};

const userSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required(),
});

export const validateUserApi = async (apiUser: ApiUser) => {
  try {
    await userSchema.validate(apiUser);
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return {
        error: err.message,
        user: null,
      };
    }

    return {
      err,
      user: null,
    };
  }

  return {
    user: apiUser,
    error: null,
  };
};
