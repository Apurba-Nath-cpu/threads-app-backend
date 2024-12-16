const queries = {};

const mutations = {
    createUser: (_: any, {}:{}) =>  {
        return 'User created successfully';
    }
};

export const resolvers = {queries, mutations};