import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID
} from 'graphql';

import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
} from './dynamo';

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    givenName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    email: {type: GraphQLString},
    phoneNumber: {type: GraphQLString},
    createdAt: {type: GraphQLFloat},
    updatedAt: {type: GraphQLFloat}
  })
});

const Query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: User,
      description: 'Get user record',
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(value, user) {
        return getUser(user.phoneNumber);
      }
    },
    users: {
      type: new GraphQLList(User),
      resolve() {
        return getUsers();
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createUser: {
      type: User,
      description: 'Create new user',
      args: {
        givenName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        email: {type: GraphQLString},
        phoneNumber: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(source, args) {
        return createUser(args);
      }
    },
    deleteUser: {
      type: User,
      description: 'Delete user',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(source, args) {
        return deleteUser(args.phoneNumber);
      }
    }
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;
