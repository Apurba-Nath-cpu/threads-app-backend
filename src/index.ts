import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db';

const PORT = Number(process.env.PORT) || 8000;

async function init() {
    const app = express();

    app.use(express.json());
    // Create GraphQL server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: () => 'Hello world!',
                say: (_, { name } : { name: string}) => `Hello, ${name}!`,
            },
            Mutation: {
                createUser: async (_, { firstName, lastName, email, password }: 
                    { firstName: string, lastName: string, email: string, password: string }) => {
                    await prismaClient.user.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            password,
                            salt: 'random_salt',
                        }
                    });
                    return true;
                },
            }
        },
    })

    // Start the gql server
    await gqlServer.start();

    app.get('/', (req, res) => {
        res.json({message: 'Server is up and running.'});
    });

    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(gqlServer),
      );

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

init();

