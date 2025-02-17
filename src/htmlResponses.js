const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);


//getIndex file
const getIndex = (request, response) => {
  //response haed
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};


//get styles
const getCSS = (request, response) => {
  //response header
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

//export
module.exports = {
  getIndex,
  getCSS,
};
