// this file is ran right after the test framework is setup for some test file.
require("@babel/polyfill");

// jest.mock('graphql-redis-subscriptions');

// https://jestjs.io/docs/en/es6-class-mocks#simple-mock-using-module-factory-parameter

require("jest-fetch-mock").enableMocks();
