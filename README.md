# Simplified, Immutable DateTime with No Timezones

  - Pure UTC
  - Second-level accuracy
  - Chaining
  - Most methods similar to native Date but without mutations

## Installation

    npm install immutable-datetime

## Usage:

```js
import DateTime from 'immutable-datetime';

let date = DateTime.fromDateString('2016-01-02');
date = date.addMonths(1).addDays(6);
console.log(date.toDateString()); // 2016-02-08
```

## License

This software is [BSD Licensed](/LICENSE).
