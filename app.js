require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listadoLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


 const main = async()=>{
    const lugares = new Busquedas();
    let opt;
   //  await pausa();
     do{

      opt = await inquirerMenu();
      switch (opt) {
        case 1:
             //Mostrar mensjae
          const lugarBusqueda = await leerInput('Lugar: ');

             //Buscar lugares
          const  lugaresdDisponibles = await lugares.ciudad(lugarBusqueda);

             //Seleccionar el lugar
          const lugar =   await  listadoLugares(lugaresdDisponibles);
             if(lugar === '0') continue;

          const lugarSelec =  lugaresdDisponibles.find((l)=>{
              if(l.id === lugar){
                 return l.nombre;
              };
            });
          lugares.historialAgregado(lugarSelec.nombre);

          console.log('Loading...'.red);

         const clima =  await lugares.climaLugar(lugarSelec.lng,lugarSelec.lat);
  


             if(lugar!=='0'){
             //clima
             //Mostrar resultados
             console.clear();
             console.log('\nInformacion de la ciudad \n'.green);
             console.log('Lugar', lugarSelec.nombre.green);
             console.log('Lat', lugarSelec.lat);
             console.log('Lng', lugarSelec.lng);
             console.log('Temperatura',clima.temp);
             console.log('Minima',clima.min);
             console.log('Maxima',clima.max);
             console.log('Descripcion',clima.desc.green);
             };
            break;
            case 2:
               lugares.historialCapitalizado.forEach((lugar,i)=>{
                  const idx = `${i+1}`.green;
                  console.log(`${idx} ${lugar}`);
               });
        default:
            break;
      };

     if(opt!==0){
        await pausa();
      };


     }while(opt!==0);

 };


 main();