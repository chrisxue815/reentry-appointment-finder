'use strict';

const bluebird = require('bluebird');
const moment = require('moment');
const rp = require('request-promise');

let start = moment('20170723', 'YYYYMMDD');
let end = moment('20170823', 'YYYYMMDD');
let weekdays = Array.from(getWeekdays(start, end));

reentry();

function* getWeekdays(start, end) {
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    let day = date.getDay();
    if (day != 0 && day != 6) {
      yield new Date(date);
    }
  }
}

async function reentry() {
  for (; ;) {
    for (let date of weekdays) {
      let dateStr = moment(date).format('DD/MM/YYYY');
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
        return;
      }
    }
  }
}
