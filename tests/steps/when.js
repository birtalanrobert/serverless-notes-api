'use strict';
const _ = require('lodash');
const Promise = this.Promise || require('promise');
const agent = require('superagent-promise')(require('superagent'), Promise);

const makeHttpRequest = async (path, method, options) => {
  const root = process.env.TEST_ROOT;
  const url = options.noteId ? `${root}/${path}/${options.noteId}` : `${root}/${path}`;
  const httpReq = agent(method, url);
  const body = _.get(options, "body");
  const idToken = _.get(options, "idToken");
  
  try {
    httpReq.set("Authorization", idToken);

    if (body) {
      httpReq.send(body);
    }

    const response = await httpReq;

    return {
      statusCode: response.status,
      body: response.body,
    };
  } catch (err) {
    return {
      statusCode: err.status,
      body: null,
    };
  }

};

exports.we_invoke_createNote = (options) => {
  const response = makeHttpRequest("notes", "POST", options);

  return response;
};

exports.we_invoke_updateNote = (options) => {
  const response = makeHttpRequest("notes", "PUT", options);

  return response;
};

exports.we_invoke_deleteNote = (options) => {
  const response = makeHttpRequest("notes", "DELETE", options);

  return response;
};