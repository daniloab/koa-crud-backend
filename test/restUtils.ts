import request from 'supertest';

import app from '../src/app';

type ApiArgs = {
  url: string | null;
  authorization: string | null;
  payload: {} | null;
  domainname: string | null;
};

export const createApiCall = async (args: ApiArgs) => {
  const { url, payload: body } = args;

  const payload = {
    ...body,
  };

  const response = await request(app.callback())
    .post(url)
    .set({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .send(JSON.stringify(payload));

  return response;
};

export const createGetApiCall = async (args: ApiArgs) => {
  const { url } = args;

  const response = await request(app.callback())
    .get(url)
    .set({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .send();

  return response;
};

export const createDeleteApiCall = async (args: ApiArgs) => {
  const { url } = args;

  const response = await request(app.callback())
    .delete(url)
    .set({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .send();

  return response;
};
