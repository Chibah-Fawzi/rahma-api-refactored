const {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} = require("graphql");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserType = require("./types/UserType");
const User = require("../models/UserModel");

const Rootquery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      args: {},
      resolve(parent, args) {
        return User.find();
      },
    },
    getUserById: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return User.findOne({ _id: args.id });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        full_name: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: new GraphQLNonNull(GraphQLString) },
        // Other user fields like full_name, etc.
      },
      resolve: async (_, args) => {
        // Destructure args
        const { email, password, full_name, role } = args;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("User already exists");
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({
          email,
          password: hashedPassword,
          full_name,
          role,
        });

        return user;
      },
    },
    login: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        // Destructure args
        const { email, password } = args;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        // Generate a token for the user
        const token = jwt.sign({ userId: user.id }, "your_secret_key", {
          expiresIn: "1d", // Token expiration time
        });

        // Return an object containing the user and the token
        return { user, token };
      },
    },
  },
});

// REQUEST EXAMPLE

// QUERY :

// query {
// 	getAllUsers {
// 		full_name
// 		email
// 	}
// }

// MUTATION :

// mutation User{
//   createUser(full_name: "John", email: "johndoe@example.com", password: "securepassword", role:"admin") {
//     full_name
//     role
//     email
//     password
//   }
// }

module.exports = new GraphQLSchema({
  query: Rootquery,
  mutation: Mutation,
});
