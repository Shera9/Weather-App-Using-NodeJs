const http=require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal=(tempVal, origVal)=>{
    let temperature = tempVal.replace("{%tempvalue%}",origVal.main.temp);
    temperature = temperature.replace("{%mintemp%}",origVal.main.temp_min);
    temperature = temperature.replace("{%maxtemp%}",origVal.main.temp_max);
    temperature = temperature.replace("{%location%}",origVal.name);
    temperature = temperature.replace("{%country%}",origVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}",origVal.weather[0].main);
    
     return temperature;
}

const server = http.createServer((req, res)=>{
    if(req.url=="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Islamabad&appid=faa9813002c2c9e559f94b0a467cdb92")
         .on("data", (chunk)=>{
          const objData=JSON.parse(chunk);
          const arrData=[objData];

          const realTimeData=arrData.map((val)=>  replaceVal(homeFile, val)).join();
          res.write(realTimeData);
         })
         .on("end", (err)=>{
             if(err) return console.log("Coonnection closed due to errors.", err);
           res.end();
         })
    }
})
server.listen(8000, "127.0.0.1");