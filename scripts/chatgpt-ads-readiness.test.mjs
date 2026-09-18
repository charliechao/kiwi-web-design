import test from 'node:test';
import assert from 'node:assert/strict';
import { assessReadiness, readinessChecks, readinessSummary } from '../src/utils/chatgpt-ads-readiness.ts';

test('an unanswered checklist is never ready', () => {
  const result = assessReadiness({});
  assert.equal(result.confirmed, 0);
  assert.equal(result.pending, 6);
  assert.equal(result.ready, false);
  assert.equal(result.gaps.length, 6);
});

test('all 729 combinations require every answer to be explicitly confirmed', () => {
  for (let combination = 0; combination < 3 ** readinessChecks.length; combination++) {
    let remaining = combination;
    const answers = Object.fromEntries(readinessChecks.map((check) => {
      const value = ['unknown', 'yes', 'no'][remaining % 3];
      remaining = Math.floor(remaining / 3);
      return [check.id, value];
    }));
    const result = assessReadiness(answers);
    const yes = Object.values(answers).filter((value) => value === 'yes').length;
    assert.equal(result.confirmed, yes);
    assert.equal(result.ready, yes === 6);
    assert.equal(result.gaps.length, 6 - yes);
    assert.equal(result.pending, Object.values(answers).filter((value) => value === 'unknown').length);
    if (answers.eligibility === 'no') assert.equal(result.title, 'Review offer eligibility first');
  }
});

test('missing and unexpected answers cannot create false readiness', () => {
  const answers = Object.fromEntries(readinessChecks.map((check) => [check.id, 'yes']));
  answers.measurement = 'approved';
  assert.equal(assessReadiness(answers).ready, false);
  delete answers.measurement;
  assert.equal(assessReadiness(answers).pending, 1);
});

test('copy output includes every status and is not an approval claim', () => {
  const summary = readinessSummary({ eligibility: 'yes', account: 'no' });
  assert.ok(summary.includes('1 of 6 checks confirmed'));
  assert.ok(summary.includes('not OpenAI approval'));
  assert.ok(summary.includes('No'));
  assert.ok(summary.includes('Not checked'));
  for (const check of readinessChecks) assert.ok(summary.includes(check.question));
});
