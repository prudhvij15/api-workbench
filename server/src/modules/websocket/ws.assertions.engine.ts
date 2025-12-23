import { WsMessage } from './ws.service';
import {
  WsAssertion,
  AssertionType,
  AssertionOperator,
  LatencyAssertion,
  ContainsAssertion,
  CountAssertion
} from './ws.assertions';

export type AssertionResult = {
  assertionId: string;
  passed: boolean;
  reason?: string;
};

export function evaluateAssertions(
  messages: WsMessage[],
  assertions: WsAssertion[]
): AssertionResult[] {
  return assertions.map((assertion) => {
    switch (assertion.type) {
      case AssertionType.LATENCY:
        return evaluateLatency(messages, assertion);

      case AssertionType.CONTAINS:
        return evaluateContains(messages, assertion);

      case AssertionType.COUNT:
        return evaluateCount(messages, assertion);

      default:
        return {
          assertionId: (assertion as WsAssertion).id,
          passed: false,
          reason: 'Unsupported assertion type'
        };
    }
  });
}

// --------- HELPERS ---------

function evaluateLatency(
  messages: WsMessage[],
  assertion: LatencyAssertion
): AssertionResult {
  const latencies = messages
    .filter(m => m.latencyMs !== undefined)
    .map(m => m.latencyMs as number);

  if (latencies.length === 0) {
    return {
      assertionId: assertion.id,
      passed: false,
      reason: 'No latency data available'
    };
  }

  const maxLatency = Math.max(...latencies);

  const passed =
    assertion.operator === AssertionOperator.LT
      ? maxLatency < assertion.value
      : assertion.operator === AssertionOperator.GT
      ? maxLatency > assertion.value
      : maxLatency === assertion.value;

  return {
    assertionId: assertion.id,
    passed,
    reason: passed
      ? undefined
      : `Latency check failed. Max latency: ${maxLatency}ms`
  };
}

function evaluateContains(
  messages: WsMessage[],
  assertion: ContainsAssertion
): AssertionResult {
  const found = messages.some(
    m => m.data.includes(assertion.value)
  );

  return {
    assertionId: assertion.id,
    passed: found,
    reason: found
      ? undefined
      : `No message contains "${assertion.value}"`
  };
}

function evaluateCount(
  messages: WsMessage[],
  assertion: CountAssertion
): AssertionResult {
  const count = messages.length;

  const passed =
    assertion.operator === AssertionOperator.EQ
      ? count === assertion.value
      : assertion.operator === AssertionOperator.GT
      ? count > assertion.value
      : count < assertion.value;

  return {
    assertionId: assertion.id,
    passed,
    reason: passed
      ? undefined
      : `Message count ${count} does not satisfy condition`
  };
}
