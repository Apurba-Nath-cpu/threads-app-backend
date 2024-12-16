import express from 'express';
import cors from 'cors';
import createApolloGraphQLServer from './graphql';
import { expressMiddleware } from '@apollo/server/express4';

const PORT = Number(process.env.PORT) || 8000;

async function init() {
    const app = express();

    app.use(express.json());
    // Create GraphQL server
    const gqlServer = await createApolloGraphQLServer();

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

