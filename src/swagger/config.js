module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Koa Crud Backend',
    description:
      'Koa Crud Backend',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'https://github.com/daniloab/koa-crud-backend',
      description: 'Production server',
    },
  ],
  security: [
    {
      AppID: [],
    },
  ],
};
