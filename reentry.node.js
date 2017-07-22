'use strict';

const bluebird = require('bluebird');
const dateFormat = require('dateformat');
const rp = require('request-promise');

function* getWeekdays(start, end) {
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    let day = date.getDay();
    if (day != 0 && day != 6) {
      yield date;
    }
  }
}

function* getWeekdaysLoop(start, end) {
  for (; ;) {
    for (let date of getWeekdays(start, end)) {
      yield date;
    }
  }
}

async function reentry() {
  let start = new Date(2017, 3, 13); // Note that the month is 0-based, i.e., 0 means January
  let end = new Date(2017, 4, 31);
  let weekdays = getWeekdaysLoop(start, end);

  for (let date of weekdays) {
    let dateStr = dateFormat(date, 'dd/mm/yyyy');
    let url = `https://reentryvisa.inis.gov.ie/website/INISOA/IOA.nsf/(getApps4DT)?openagent&dt=${dateStr}&type=I&num=1&_=1480154930796`;
    let options = {
      url: url,
      ciphers: 'DES-CBC3-SHA',
    };

    try {
      let body = await rp(options);
      let json = JSON.parse(body);

      if (json.empty !== 'TRUE') {
        console.log(dateStr, ' ', body);
      }

      await bluebird.delay(1000);
    }
    catch (ex) {
      console.log(dateStr, ' ', ex);
      break;
    }
  }
}

reentry();
