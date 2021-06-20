import { Request, Response } from 'express';

export const home = (request: Request, response: Response) => {
  response.render('index', {});
};

export const uploadFile = (request: Request, response: Response) => {
  response.render('upload', {});
};

export const graphs = (request: Request, response: Response) => {
  response.render('graphs', {});
};

export const age = (request: Request, response: Response) => {
  const { firstAge, lastAge } = request.query;
  response.render('graphs/age', {
    firstAge: firstAge ? firstAge : 0,
    lastAge: lastAge ? lastAge : 100,
  });
};

export const patient = (request: Request, response: Response) => {
  response.render('graphs/patient', {});
};

export const decease = (request: Request, response: Response) => {
  response.render('graphs/decease', {});
};

export const hospitalized = (request: Request, response: Response) => {
  response.render('graphs/hospitalized', {});
};
