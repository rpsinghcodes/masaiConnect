import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: '', // by default: '1.0.0'
        title: 'Masai Level Up API', // by default: 'Swagger API'
        description:
            'This is a working server for Masai Level Up API. It is a Node.js application that uses Express.js as the web framework. It provides a RESTful API for managing user accounts, courses, and sessions.',
    },

    host: 'localhost:3000',
    schemes: ['http'],
    basePath: '/api/v1',

    servers: [
        {
            url: '', // by default: 'http://localhost:3000'
            description: '', // by default: ''
        },
        // { ... }
    ],
    tags: [
        // by default: empty Array
        {
            name: '', // Tag name
            description: '', // Tag description
        },
        // { ... }
    ],
    components: {}, // by default: empty object
};

const outputFile = 'src/api-docs.json';
const routes = ['src/routes/index.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);
