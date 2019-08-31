import moment from 'moment';
import prompts from 'prompts';

export async function main() {
  let { total } = await prompts({
    type: 'text',
    name: 'total',
    message: 'How much do you have in the bank?',
  });
  total = parseInt(total.replace(/,/g, ''));
  let { amount } = await prompts({
    type: 'text',
    name: 'amount',
    message: 'What amount do you withdraw each time?',
  });
  amount = parseInt(amount.replace(/,/g, ''));

  let { days } = await prompts({
    type: 'text',
    name: 'days',
    message: 'On what days of the month do you withdraw the amount? (comma-separated)',
  });
  days = days.split(',').map((x) => parseInt(x));

  let endDate = moment();
  let dayIndex = 0;
  while( ( total - amount ) > 0 ) {
    // If the indicated day is greater than current day, increment to that day.
    if ( days[dayIndex] > endDate.format('D') ) {
      endDate.add((days[dayIndex] - endDate.format('D')), 'days');
    // If the current day is greater than the indicated, we need to go to the next month
    // and reset to the indicated day.
    } else if ( endDate.format('D') > days[dayIndex] ) {
      endDate.add(1, 'month');
      endDate.startOf('month');
      endDate.add(days[dayIndex], 'days');
    }
    // Withdraw the amount.
    total = total - amount;
    // Iterate through multiple days if provided.
    dayIndex++;
    if ( typeof days[ dayIndex ] === 'undefined' ) {
      dayIndex = 0;
    }
  }
  console.log( 'Your last withdrawl of ' + amount + ' will be on ' + endDate.format('MMMM Do YYYY') + ' with ' + total + ' left in the bank.');
}
