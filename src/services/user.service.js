const httpStatus = require('http-status');
const User = require('../models/user.model.js');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) 
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  

  const user = await User.create(userBody);
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1) a.user = usersResult.results.find( user => user.id == a.userId);
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id, projection) => {
  const user = await User.findById(id, projection);
  return user;
};

const addUsersToArray = async (arr) => {
  const usersResult = await User.find({'_id' : { $in : [...new Set(arr.map(m => m.userId + ''))]}}).select({ id: 1, username: 1}).exec();
  
  for (let i in arr) { 
    arr[i] = arr[i].toObject(); 
    arr[i].user = usersResult.find( u => u.id == arr[i].userId); 
  }

  return arr;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  
  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId, {});
  if (!user) 
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) 
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId, {});
  if (!user) 
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  
  await user.remove();
  return user;
};

const increment = async (id, field, value) => {
  const obj = {}; obj[field] = value;

  const user = await User.findOneAndUpdate({_id: id}, {$inc: obj}, {useFindAndModify: false});
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  addUsersToArray,
  increment,
};
