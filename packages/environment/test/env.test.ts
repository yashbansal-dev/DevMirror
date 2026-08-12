import test from 'node:test';
import assert from 'node:assert';
import { EnvironmentManager } from '../src/index.js';

test('EnvironmentManager masks secrets correctly', () => {
  const maskedSecret = EnvironmentManager.maskSecret('DATABASE_URL', 'postgresql://user:pass@localhost:5432/db');
  assert.strictEqual(maskedSecret.includes('pass'), false);
  assert.ok(maskedSecret.includes('...'));

  const nonSecret = EnvironmentManager.maskSecret('PORT', '3000');
  assert.strictEqual(nonSecret, '3000');
});
