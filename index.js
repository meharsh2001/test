const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);                   //temp
 temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);                //min temp
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);               //max temp
  temperature = temperature.replace("{%location%}", orgVal.name);                       //name
  temperature = temperature.replace("{%country%}", orgVal.sys.country);                 //country
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);          //weather

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=delhi&units=metric&appid=1718fb2bd7ea057233c9af7a69aaa46c`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
       //  console.log(arrData[0].main.temp);
       const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join(""); //.MAP() FOR ARRAY MANUPULATION // homeFile = home.html
       res.write(realTimeData);
      //  console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(process.env.PORT || 8080, "127.0.0.1");
