//user object
const users = {};

//responses
const respondJSON = (request, response, status, object) => {

    const content = JSON.stringify(object);

    //response headers
    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    };
    response.writeHead(status, headers);

    if (request.method !== 'HEAD') {
        response.write(content);
    }

    response.end();
};


//getUsers responses, etc!
const getUsers = (request, response) => {
    //response object
    const responseJSON = {
        users,
    };
    return respondJSON(request, response, 200, responseJSON);
};



//add user func!
const addUser = (request, response) => {
    //default responses
    const responseJSON = {
        message: 'Name and age are both required.',
    };

    //destructure name and age
    const { name, age } = request.body;

    if (!name || !age) {
        responseJSON.id = 'addUserMissingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 204;

    //no user = new entry
    if (!users[name]) {
        responseCode = 201;
        users[name] = {
            name,
        };
    }

    //update age
    users[name].age = age;

    //new user = yay!
    if (responseCode === 201) {
        responseJSON.message = 'Created Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSON(request, response, responseCode, {});
};


//no page
const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    //error message
    respondJSON(request, response, 404, responseJSON);
};

//export
module.exports = {
    getUsers,
    addUser,
    notFound,
};
