// What kind of assertion we are doing
export enum AssertionType {
  LATENCY = 'LATENCY',
  CONTAINS = 'CONTAINS',
  COUNT = 'COUNT'
}

// How the assertion compares values
export enum AssertionOperator {
  LT = '<',
  GT = '>',
  EQ = '=',
  CONTAINS = 'contains'
}

// Base assertion shape
export interface BaseAssertion {
  id: string;
  type: AssertionType;
  operator: AssertionOperator;
  value: number | string;
}

// Latency assertion
export interface LatencyAssertion extends BaseAssertion {
  type: AssertionType.LATENCY;
  value: number; // milliseconds
}

// Message content assertion
export interface ContainsAssertion extends BaseAssertion {
  type: AssertionType.CONTAINS;
  field: 'data';
  value: string;
}

// Message count assertion
export interface CountAssertion extends BaseAssertion {
  type: AssertionType.COUNT;
  value: number;
}

// Union of all supported assertions
export type WsAssertion =
  | LatencyAssertion
  | ContainsAssertion
  | CountAssertion;
