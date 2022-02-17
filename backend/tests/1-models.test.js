const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { getConnection } = require('./utils/mongoMockConnection');
const { ObjectId } = require('mongodb');

const mongoConnection = require('../src/api/models/connection');
const userModel = require('../src/api/models/usersModel');
const taskModel = require('../src/api/models/taskModel');

describe('User model tests', () => {
  let connectionMock;


  const payloadUser = {
    user: {
      name: 'thiago',
      email: 'thiago@gmail.com',
      role: 'user',
      _id: '620d47e176c196367820db45'
    }
  };

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  /* Restauraremos a função `connect` original após os testes. */
  after(() => {
    MongoClient.connect.restore();
  });

  describe('when it is successfully entered', () => {
    it('user: returns an object', async () => {
      const response = await userModel.create(payloadUser);

      expect(response).to.be.a('object');
    });

    it('there must be a user with the registered name!', async () => {
      await userModel.create(payloadUser);
      const userCreated = await connectionMock
        .db('todo_task')
        .collection('users')
        .findOne({ user: payloadUser.name });
      expect(userCreated).to.be.not.null;
    });

    it('there must be a user with the registered email!', async () => {
      await userModel.create(payloadUser);
      const userCreated = await connectionMock
        .db('todo_task')
        .collection('users')
        .findOne({ user: payloadUser.email });
      expect(userCreated).to.be.not.null;
    });

    it('there must be a user with the registered password!', async () => {
      await userModel.create(payloadUser);
      const userCreated = await connectionMock
        .db('todo_task')
        .collection('users')
        .findOne({ user: payloadUser.password });
      expect(userCreated).to.be.not.null;
    });

    it('there must be a user with the registered role!', async () => {
      await userModel.create(payloadUser);
      const userCreated = await connectionMock
        .db('todo_task')
        .collection('users')
        .findOne({ user: payloadUser.role });
      expect(userCreated).to.be.not.null;
    });

    it('there must be a user with the registered id!', async () => {
      await userModel.create(payloadUser);
      const userCreated = await connectionMock
        .db('todo_task')
        .collection('users')
        .findOne({ user: payloadUser._id });
      expect(userCreated).to.be.not.null;
    });

  });
});

describe('Task model tests', () => {
  let connectionMock;


  const payloadTask = {
    newTask: {
      status: 'pendente',
      task: 'fazer o almoço',
      userId: '620c08b82116bea2ba998b94',
      _id: '620d47e176c196367820db45'
    }
  };

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  /* Restauraremos a função `connect` original após os testes. */
  after(() => {
    MongoClient.connect.restore();
  });

  describe('when it is successfully entered', () => {
    it('task: returns an object', async () => {
      const response = await taskModel.createTask(payloadTask);

      expect(response).to.be.a('object');
      
    });
    it('there must be a task with the registered status!', async () => {
      const createTaskResult = await taskModel.createTask('pendente', 'fazer o almoço', '620c08b82116bea2ba998b94');

      const foundTask = await connectionMock
        .db('todo_task')
        .collection('tasks')
        .findOne(ObjectId(createTaskResult.ops[0]._id));

      expect(foundTask).to.have.property('status', 'pendente');
    });
  })
    
});


// FROM node:14-alpine as backendTelzir
// WORKDIR /telzir-backend
// ADD ./node_modules.tar.xz ./
// COPY . .
// EXPOSE 3001
// CMD ["npm", "install"]
// ENTRYPOINT ["npm", "start"]