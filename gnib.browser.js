// Open the following link in chrome:
// https://burghquayregistrationoffice.inis.gov.ie
// Right-click, Inspect, Console, copy and paste the following scripts, press enter.
// After a few seconds if "Running" shows up and the number on the left increments over time, it means it's working.
// A popup window will show up when there are available slots.
// Note that slots are independent for typ=New and typ=Renewal.

startDate = '20170723';
endDate = '20170823';
intervalMilliseconds = 5000;

libs = [
  'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
];

numLoadedLibs;

for (lib of libs) {
  node = document.createElement('script');
  node.type = 'text/javascript';
  node.src = lib;
  node.async = true;
  node.addEventListener('load', onLibLoaded)
  document.head.appendChild(node);
}

function onLibLoaded() {
  numLoadedLibs++;
  if (numLoadedLibs < libs.length) return;

  start = moment(startDate, 'YYYYMMDD');
  end = moment(endDate, 'YYYYMMDD');

  urls = [
    `https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/(getAppsNear)?openpage&cat=Work&sbcat=All&typ=New&_=1503338430497`,
    `https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/(getAppsNear)?openpage&cat=Work&sbcat=All&typ=Renewal&_=1503338430497`,
    `https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/(getApps4DTAvailability)?openpage&&cat=Work&sbcat=All&typ=New&_=1503392385907`,
    `https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/(getApps4DTAvailability)?openpage&&cat=Work&sbcat=All&typ=Renewal&_=1503392385907`,
  ];

  index = -1;

  intervalId = setInterval(gnib, intervalMilliseconds);

  function gnib() {
    console.log('Running');
    index++;
    url = urls[index % urls.length];

    $.getJSON(url)
      .done(json => {
        if (json.slots && json.slots.length > 0 && json.slots !== '[]') {
          for (let slot of json.slots) {
            let time = slot.time
              ? moment(slot.time, 'DD MMMM YYYY - HH:mm')
              : moment(slot, 'DD/MM/YYYY');

            if (time >= start && time <= end) {
              msg = url + '\n\n' + JSON.stringify(json);
              console.log(msg);
              alert(msg);
              clearInterval(intervalId);
            }
          }
        }
      })
      .fail((jqxhr, textStatus, error) => {
        err = 'Request Failed: ' + textStatus + ', ' + error + '\n\n' + url;
        console.error(err);
        alert(err);
        clearInterval(intervalId);
      });
  }
}
