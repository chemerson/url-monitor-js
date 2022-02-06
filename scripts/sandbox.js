
function printTime() {
    let today = new Date()
    const arr = [
      today.getHours().toString(),
      today.getMinutes().toString(),
      today.getSeconds().toString(),
      (today.getMonth() + 1).toString(),
      today.getDate().toString(),
      today.getFullYear().toString()
    ]
    const t = arr.map(str => str.padStart(2, '0'));
    const clock = t[0] + ":" + t[1] + ":" + t[2]

    console.log(clock);
    return (t[3] + "-" + t[4] + "-" + t[5] + " " + clock)
  }

  console.log(printTime())