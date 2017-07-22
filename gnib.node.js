'use strict';

const bluebird = require('bluebird');
const dateFormat = require('dateformat');
const rp = require('request-promise');

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

        if (json.slots && json.slots.length > 0) {
          console.log(url);
          console.log(body);
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

gnib();
