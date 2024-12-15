import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

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
        `,
        resolvers: {
            Query: {
                hello: () => 'Hello world!',
                say: (_, { name } : { name: string}) => `Hello, ${name}!`,
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

