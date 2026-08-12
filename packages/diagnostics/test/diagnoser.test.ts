import test from 'node:test';
import assert from 'node:assert';
import { Diagnoser } from '../src/index.js';

test('Diagnoser detects missing DATABASE_URL with high confidence', () => {
  const diagnoser = new Diagnoser();
  const mockError = 'PrismaClientInitializationError: DATABASE_URL is missing in environment variables.';
  const diag = diagnoser.diagnose(mockError);

  assert.strictEqual(diag.success, false);
  assert.ok(diag.observedFact.includes('DATABASE_URL'));
  assert.strictEqual(diag.confidence, 96);
  assert.ok(diag.suggestedFix.includes('DATABASE_URL'));
});

test('Diagnoser detects port in use error', () => {
  const diagnoser = new Diagnoser();
  const mockError = 'Error: listen EADDRINUSE: address already in use :::3000';
  const diag = diagnoser.diagnose(mockError);

  assert.strictEqual(diag.success, false);
  assert.ok(diag.observedFact.includes('3000'));
  assert.strictEqual(diag.confidence, 98);
});
