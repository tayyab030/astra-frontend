const fs = require('fs');
const p = 'd:/Development/Personal/astra-frontend/app/app/habits/_components/HabitsContent.tsx';
let t = fs.readFileSync(p, 'utf8');
const from = 'Reason: {habit.delayReason}';
const to =
  '{isLate || habit.isOverdueCarry ? "Late / overdue: " : "Reason: "}{habit.delayReason}';
if (!t.includes(from)) {
  console.error('not found');
  process.exit(1);
}
fs.writeFileSync(p, t.replace(from, to));
console.log('ok');
