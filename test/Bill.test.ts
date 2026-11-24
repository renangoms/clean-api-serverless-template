import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Bill, addMonths } from '../src/application/entities/Bill';

const base = { accountId: 'a', type: 'payable' as const, description: 'x' };

test('parcelas: resto vai na primeira e soma fecha', () => {
  const bills = Bill.createInstallments({ ...base, totalCents: 10000, installments: 3, firstDueDate: '2026-01-31' });
  assert.deepEqual(bills.map(b => b.amountCents), [3334, 3333, 3333]);
  assert.deepEqual(bills.map(b => b.dueDate), ['2026-01-31', '2026-02-28', '2026-03-31']);
  assert.equal(new Set(bills.map(b => b.groupId)).size, 1);
});

test('addMonths vira o ano', () => {
  assert.equal(addMonths('2026-11-15', 3), '2027-02-15');
});

test('baixa parcial, total, excesso e estorno', () => {
  const [b] = Bill.createInstallments({ ...base, totalCents: 1000, installments: 1, firstDueDate: '2026-12-01' });
  b.settle(400);
  assert.equal(b.status('2026-11-01'), 'open');
  assert.throws(() => b.settle(601), /exceeds/);
  b.settle(600);
  assert.equal(b.status('2026-11-01'), 'paid');
  b.reverse(600);
  assert.equal(b.paidCents, 400);
  assert.equal(b.status('2026-11-01'), 'open');
});

test('atrasado e cancelado', () => {
  const [b] = Bill.createInstallments({ ...base, totalCents: 1000, installments: 1, firstDueDate: '2026-10-01' });
  assert.equal(b.status('2026-11-01'), 'overdue');
  b.settle(100);
  assert.throws(() => b.cancel(), /Reverse/);
  b.reverse(100);
  b.cancel();
  assert.equal(b.status('2026-11-01'), 'canceled');
  assert.throws(() => b.settle(1), /canceled/);
});
