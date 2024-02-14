
 const fs = require('fs');
 const axios = require('axios');




 class Busquedas {
     
    historial = [];
    dbPath = './db/datebase.json';

     constructor(){
        this.leerDB();
     };

      get paramsMapTiler(){
          return {
            'key': process.env.MAP_TILER_KEY, 
            'limit':3,
            'language': 'es',
            'Match': true,
          };
      };


      get historialCapitalizado(){
         return this.historial.map((lugar)=>{
            let palabra = lugar.split(' ');
            palabra = palabra.map((p)=>p[0].toUpperCase() + p.substring(1));
            return palabra.join(' ');
         });
      };

     async ciudad(lugar = ''){

         try {
            const intancia = axios.create({
               baseURL: `https://api.maptiler.com/geocoding/${lugar}.json`,
               params: this.paramsMapTiler,
             });

             const resp = await intancia.get();

              return resp.data.features.map(lugar=>({
                  id: lugar.id,
                  nombre:lugar.place_name,
                  lat: lugar.center[0],
                  lng: lugar.center[1],
             }));
            
         } catch (error) {
          console.log(error);
            return [];
         };
        
     };

     get paramsOpenWeather(){
       return {
         'appid': process.env.OPEN_WHEATHER_KEY,
         'lang':'es',
         'units':'metric'
       };
     };

     async climaLugar(lat,lon){
   
      const url =   `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`;

      try {
         const instancia = axios.create({
            baseURL: url,
            params: this.paramsOpenWeather,
         });

         const resp = await instancia.get();
        const [time] = resp.data.weather;
        const {temp_min,temp_max,temp} = resp.data.main;
        
        return {
          desc:time.description,
          min:temp_min,
          max:temp_max,
          temp: (temp)?temp:'hola',
        };

      }catch (error) {
         console.log('error al llamar api =========>',error);
        };
     };

  historialAgregado(lugar = ''){

    if(this.historial.includes(lugar.toLocaleLowerCase())) return;

    this.historial = this.historial.splice(0,5);

    this.historial.unshift(lugar.toLocaleLowerCase());
     //Grabar en DB  
      this.guardarDB();
     };

     guardarDB(){
      const payload = {
         historial:this.historial,
      };

      fs.writeFileSync(this.dbPath,JSON.stringify(payload));
     };

     leerDB(){
      if(!fs.existsSync(this.dbPath)){
         return null;
      };

      const info = fs.readFileSync(this.dbPath,{encoding:'utf-8'});
      const data = JSON.parse(info);
      const {historial} = data;
      this.historial = historial;
     };
 };

 module.exports = Busquedas;