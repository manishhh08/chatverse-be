import Joi from "joi";

const joiValidator = (schema, req, res, next) => {
  const { error } = schema.validate(req.body);
  error
    ? res.status(404).json({
        status: "error",
        message: error.message,
      })
    : next();
};

export const loginValidation = (req, res, next) => {
  let loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  joiValidator(loginSchema, req, res, next);
};

export const createUserValidation = (req, res, next) => {
  let createUserSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string(),
    password: Joi.string().required(),
  });

  joiValidator(createUserSchema, req, res, next);
};

export const verifyUserValidation = (req, res, next) => {
  let verifyUserSchema = Joi.object({
    token: Joi.string().required(),
    email: Joi.string().required(),
  });

  joiValidator(verifyUserSchema, req, res, next);
};

export const createChatValidation = (req, res, next) => {
  let createChatSchema = Joi.object({
    name: Joi.string().optional(),
    members: Joi.array().items(Joi.string().required()).min(1).required(),
    isGroup: Joi.boolean().required(),
  });
  joiValidator(createChatSchema, req, res, next);
};

export const getChatsSchema = (req, res, next) => {
  let getChatSchema = Joi.object({
    limit: Joi.number().integer().min(1).optional(),
    page: Joi.number().integer().min(1).optional(),
  });
  joiValidator(getChatSchema, req, res, next);
};
