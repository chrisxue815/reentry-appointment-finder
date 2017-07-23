'use strict';

const bluebird = require('bluebird');
const moment = require('moment');
const rp = require('request-promise');

let start = moment('20170723', 'YYYYMMDD');
let end = moment('20170823', 'YYYYMMDD');

gnib();

async function gnib() {
  let urls = [
    `https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/(getAppsNear)?openpage&cat=Work&sbcat=All&typ=New&_=1503338430497`,
    `https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/(getAppsNear)?openpage&cat=Work&sbcat=All&typ=Renewal&_=1503338430497`,
    `https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/(getApps4DTAvailability)?openpage&&cat=Work&sbcat=All&typ=New&_=1503392385907`,
    `https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/(getApps4DTAvailability)?openpage&&cat=Work&sbcat=All&typ=Renewal&_=1503392385907`,
  ];

  for (; ;) {
    for (let url of urls) {
      let options = {
        url: url,
        ciphers: 'DES-CBC3-SHA',
        rejectUnauthorized: false,
      };

      try {
        let body = await rp(options);
        let json = JSON.parse(body);

        if (json.slots && json.slots.length > 0 && json.slots !== '[]') {
          for (let slot of json.slots) {
            let time = slot.time
              ? moment(slot.time, 'DD MMMM YYYY - HH:mm')
              : moment(slot, 'DD/MM/YYYY');

            if (time >= start && time <= end) {
              console.log(url);
              console.log(body);
            }
          }
        }

        await bluebird.delay(5000);
      }
      catch (ex) {
        console.log(url);
        console.log(ex);
        return;
      }
    }
  }
}
