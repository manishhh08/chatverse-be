import User from "./userSchema.js";

export const newUser = (userObject) => {
  return User.insertOne(userObject);
};

export const getAllUsers = () => {
  return User.find();
};
export const findById = (userId) => {
  return User.findById(userId);
};

export const findByFilter = (filterObj) => {
  return User.findOne(filterObj);
};

export const updateById = (userId, updateObj) => {
  return User.findByIdAndUpdate(userId, updateObj, { new: true });
};

export const deleteById = (userId) => {
  return User.findOneAndDelete(userId);
};
