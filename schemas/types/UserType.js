const { GraphQLInt, GraphQLString, GraphQLObjectType } = require("graphql");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    full_name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    role: { type: GraphQLString },
    token: { type: GraphQLString },
  }),
});

module.exports = UserType;
