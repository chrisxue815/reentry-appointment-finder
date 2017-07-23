// Open the following link in chrome:
// https://reentryvisa.inis.gov.ie
// Right-click, Inspect, Console, copy and paste the following scripts, press enter.
// After a few seconds if "Running" shows up and the number on the left increments over time, it means it's working.
// A popup window will show up when there are available slots.

libs = [
  'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
];

for (lib of libs) {
  node = document.createElement('script');
  node.type = 'text/javascript';
  node.src = lib;
  document.head.appendChild(node);
}

start = moment('20170826', 'YYYYMMDD');
end = moment('20171026', 'YYYYMMDD');
intervalMilliseconds = 3000;

weekdays = Array.from(getWeekdays(start, end));
index = -1;
intervalId = setInterval(gnib, intervalMilliseconds);

function gnib() {
  console.log('Running');
  index++;
  weekday = weekdays[index % weekdays.length];
  dateStr = moment(weekday).format('DD/MM/YYYY')
  url = `https://reentryvisa.inis.gov.ie/website/INISOA/IOA.nsf/(getApps4DT)?openagent&dt=${dateStr}&type=I&num=1&_=1480154930796`;

  $.getJSON(url)
    .done(json => {
      if (json.empty !== 'TRUE') {
        msg = url + '\n\n' + JSON.stringify(json);
        console.log(msg);
        alert(msg);
        clearInterval(intervalId);
      }
    })
    .fail((jqxhr, textStatus, error) => {
      err = 'Request Failed: ' + textStatus + ', ' + error + '\n\n' + url;
      console.log(err);
      alert(err);
      clearInterval(intervalId);
    });
}

function* getWeekdays(start, end) {
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    let day = date.getDay();
    if (day != 0 && day != 6) {
      yield new Date(date);
    }
  }
}
