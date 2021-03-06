// https://github.com/graphql/graphql-relay-js/blob/4fdadd3bbf3d5aaf66f1799be3e4eb010c115a4a/src/utils/base64.js
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type Base64String = string;

export function base64(i: string): Base64String {
  return Buffer.from(i, "utf8").toString("base64");
}

export function unbase64(i: Base64String): string {
  return Buffer.from(i, "base64").toString("utf8");
}
