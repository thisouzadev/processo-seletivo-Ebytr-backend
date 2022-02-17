const { ObjectId } = require('mongodb');
const connect = require('./connection');

const createTask = async (status, task, userId) => {
  const db = await connect();
  // const { insertedId } = await db.collection('tasks').insertOne({
  const createResult = await db.collection('tasks').insertOne({

    status, task, userId,
  });
  // return { newTask: {  status, task, userId, _id: insertedId} }
  return createResult;
};

const findAll = async () => {
  const db = await connect();
  const task = await db.collection('tasks').find({}).toArray();
  return task;
};

const update = async (id, task) => {
  const db = await connect();
  const result = await db.collection('tasks').updateOne(
    { _id: ObjectId(id) }, { $set: task },
  );
  return result;
};

const findById = async (id) => {
  const db = await connect();
  const insertedId = await db.collection('tasks').findOne({ _id: ObjectId(id) });

  return insertedId;
};

const exclude = async (id) => {
  const db = await connect();
  const recipe = await findById(id);
  await db.collection('tasks').deleteOne({ _id: ObjectId(id) });
  return recipe;
};

module.exports = {
  createTask,
  findAll,
  update,
  findById,
  exclude,
};