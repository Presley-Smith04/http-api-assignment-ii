const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

//port
const port = process.env.PORT || process.env.NODE_PORT || 3000;


//map url to paths
const urlStruct = {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/addUser': jsonHandler.addUser,
    '/getUsers': jsonHandler.getUsers, 
    notFound: jsonHandler.notFound,
};



//pase body
const parseBody = (request, response, handler) => {
    const body = [];

    //err
    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    //get data
    request.on('data', (chunk) => {
        body.push(chunk);
    });

    //all data = parse body -> send requests
    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        request.body = query.parse(bodyString);
        handler(request, response);
    });
};


//request for addUser
const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/addUser') {
        parseBody(request, response, jsonHandler.addUser);
    }
};


//request
const onRequest = (request, response) => {
    //http or https
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    //POST
    if (request.method === 'POST') {
        return handlePost(request, response, parsedUrl);
    }

    //path exists = call handler
    if (urlStruct[parsedUrl.pathname]) {
        return urlStruct[parsedUrl.pathname](request, response);
    }

    //no path, no handler
    return urlStruct.notFound(request, response);
};


//make server
http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
});
