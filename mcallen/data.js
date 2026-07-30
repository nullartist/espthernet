'use strict';
const APP_VERSION='4.0.0';
const root=r=>typeof r==='string'?document.querySelector(r):r;
const $=(s,r=document)=>root(r).querySelector(s), $$=(s,r=document)=>[...root(r).querySelectorAll(s)];
const STORE_META='mcallen.meta';
const store={
  get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch{return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));const meta={version:APP_VERSION,updatedAt:new Date().toISOString()};localStorage.setItem(STORE_META,JSON.stringify(meta));window.dispatchEvent(new CustomEvent('mcallen:saved',{detail:meta}));return true}catch{return false}},
  remove(k){try{localStorage.removeItem(k);return true}catch{return false}},
  available(){try{const k='__mcallen_test__';localStorage.setItem(k,'1');localStorage.removeItem(k);return true}catch{return false}}
};
const mapUrl=q=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const wazeUrl=q=>`https://www.waze.com/ul?q=${encodeURIComponent(q)}&navigate=yes`;
function allSpots(){return [...spots,...store.get('mcallen.customPlaces',[])];}
function getSpot(id){return allSpots().find(p=>p.id===id);}
const directionsUrl=ids=>{const ps=ids.map(getSpot).filter(Boolean);if(ps.length<2)return mapUrl(ps[0]?.query||'McAllen TX');const origin=encodeURIComponent(ps[0].query),destination=encodeURIComponent(ps.at(-1).query),waypoints=encodeURIComponent(ps.slice(1,-1).map(p=>p.query).join('|'));return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;};
const spots=[
{id:'hidalgo',name:'Puente Internacional Hidalgo',cat:'Cruce',icon:'🌉',zone:'Frontera',query:'Hidalgo International Bridge, Hidalgo, TX',desc:'Abierto 24 horas; respaldo flexible para llegar al sur de McAllen.',lat:26.1014,lon:-98.2632,map:[133,452]},
{id:'anzalduas',name:'Puente Internacional Anzaldúas',cat:'Cruce',icon:'🌉',zone:'Frontera',query:'Anzalduas International Bridge, Mission, TX',desc:'Abre de 06:00 a 22:00; buena alternativa cuando la fila sea menor.',lat:26.1164,lon:-98.3187,map:[49,447]},
{id:'pharrbridge',name:'Puente Internacional Pharr',cat:'Cruce',icon:'🌉',zone:'Frontera',query:'Pharr-Reynosa International Bridge, Pharr, TX',desc:'Úsalo sólo cuando coincida la ventana de pasajeros y la espera convenga.',lat:26.0648,lon:-98.2053,map:[302,455]},
{id:'comfort',name:'Comfort Inn & Suites Pharr–McAllen',cat:'Hotel',icon:'🏨',zone:'Pharr',query:'Comfort Inn & Suites Pharr McAllen, 2706 N Cage Blvd, Pharr, TX',desc:'Base práctica cerca de Cage/Expressway, con desayuno incluido.',lat:26.2238,lon:-98.1844,map:[302,294]},
{id:'home2',name:'Home2 Suites by Hilton McAllen',cat:'Hotel',icon:'🏨',zone:'Convention Center',query:'Home2 Suites by Hilton McAllen, 525 S Ware Rd, McAllen, TX',desc:'Suites con cocina, desayuno caliente y mejor comodidad con niños.',lat:26.1972,lon:-98.2595,map:[52,320]},
{id:'plaza',name:'La Plaza Mall',cat:'Compras',icon:'🏬',zone:'Sur',query:'La Plaza Mall, 2200 S 10th St, McAllen, TX',desc:'Centro comercial principal; dale su propio bloque de tiempo.',lat:26.1833,lon:-98.2374,map:[91,368]},
{id:'target',name:'Target McAllen',cat:'Compras',icon:'🎯',zone:'Expressway/Jackson',query:'Target, 708 E Expressway 83, McAllen, TX',desc:'Encargos generales, farmacia CVS, Starbucks y Drive Up.',lat:26.1909,lon:-98.2185,map:[153,327]},
{id:'marshallsSouth',name:'Marshalls Expressway',cat:'Compras',icon:'🛍️',zone:'Expressway/Jackson',query:'Marshalls, 900 E Expressway 83, McAllen, TX',desc:'La sucursal sur encaja perfecto con Target y Ross.',lat:26.1908,lon:-98.2163,map:[166,327]},
{id:'rossSouth',name:'Ross Dress for Less Expressway',cat:'Compras',icon:'👗',zone:'Expressway/Jackson',query:'Ross Dress for Less, 620 E Expressway 83, McAllen, TX',desc:'Ropa y hogar; conviene llegar temprano para mejor selección.',lat:26.1908,lon:-98.2206,map:[143,327]},
{id:'bestbuy',name:'Best Buy Jackson',cat:'Compras',icon:'💻',zone:'Expressway/Jackson',query:'Best Buy, 700 S Jackson Rd, McAllen, TX',desc:'La sucursal que mejor se integra a la ruta sur.',lat:26.1915,lon:-98.2077,map:[207,323]},
{id:'walmart',name:'Walmart Supercenter Jackson',cat:'Compras',icon:'🛒',zone:'Expressway/Jackson',query:'Walmart Supercenter, 1200 E Jackson Ave, McAllen, TX',desc:'Básicos, compras finales y horario amplio.',lat:26.1902,lon:-98.2016,map:[230,331]},
{id:'grand',name:'Grand China Buffet',cat:'Comida',icon:'🥡',zone:'Pharr/Jackson',query:'Grand China Buffet, 500 N Jackson Rd, Pharr, TX',desc:'Imperdible familiar y muy cerca del corredor Jackson.',lat:26.2071,lon:-98.2011,map:[236,351]},
{id:'whataburger',name:'Whataburger Jackson',cat:'Comida',icon:'🥤',zone:'Expressway/Jackson',query:'Whataburger, 1412 E Jackson Ave, McAllen, TX',desc:'Parada oficial para malteadas; la ciencia aún estudia por qué son necesarias.',lat:26.1906,lon:-98.1988,map:[247,331]},
{id:'ihopSouth',name:'IHOP Sur',cat:'Comida',icon:'🥞',zone:'Sur',query:'IHOP, 1900 S 10th St, McAllen, TX',desc:'Desayuno/cena cerca de La Plaza y el aeropuerto.',lat:26.1862,lon:-98.2377,map:[91,350]},
{id:'hobby',name:'Hobby Lobby Trenton Crossing',cat:'Compras',icon:'🎨',zone:'Norte/Trenton',query:'Hobby Lobby, 7600 N 10th St Bldg 300, McAllen, TX',desc:'Combínalo con Marshalls, Ross y Best Buy North; cierra los domingos.',lat:26.2794,lon:-98.2296,map:[91,112]},
{id:'marshallsNorth',name:'Marshalls North McAllen',cat:'Compras',icon:'🛍️',zone:'Norte/Trenton',query:'Marshalls, 7600 N 10th St, McAllen, TX',desc:'Mismo corredor de Hobby Lobby y Ross.',lat:26.2791,lon:-98.2307,map:[80,112]},
{id:'rossNorth',name:'Ross North McAllen',cat:'Compras',icon:'👗',zone:'Norte/Trenton',query:'Ross Dress for Less, 7600 N 10th St, McAllen, TX',desc:'Útil si prefieren concentrar las tiendas de descuento al norte.',lat:26.2790,lon:-98.2288,map:[103,112]},
{id:'bestbuyNorth',name:'Best Buy North McAllen',cat:'Compras',icon:'💻',zone:'Norte/Trenton',query:'Best Buy, 8012 N 10th St, McAllen, TX',desc:'Alternativa si el día norte incluye electrónica.',lat:26.2852,lon:-98.2295,map:[91,91]},
{id:'imas',name:'International Museum of Art & Science',cat:'Niños',icon:'🦖',zone:'Norte',query:'IMAS McAllen, 1900 W Nolana Ave, McAllen, TX',desc:'Pausa con niños para cortar la maratón de tiendas.',lat:26.2376,lon:-98.2382,map:[91,201]},
{id:'quinta',name:'Quinta Mazatlán',cat:'Niños',icon:'🌿',zone:'Sur',query:'Quinta Mazatlan, 600 Sunset Dr, McAllen, TX',desc:'Jardines y naturaleza cerca de La Plaza; descanso breve y agradable.',lat:26.1758,lon:-98.2292,map:[113,390]},
{id:'heb',name:'H‑E‑B Plus! Pharr',cat:'Esenciales',icon:'🥑',zone:'Pharr',query:'H-E-B Plus, 1300 S Cage Blvd, Pharr, TX',desc:'Despensa y básicos cerca de la base en Pharr.',lat:26.1837,lon:-98.1838,map:[302,367]},
{id:'walgreens',name:'Walgreens Jackson',cat:'Esenciales',icon:'💊',zone:'Jackson',query:'Walgreens near Jackson Rd McAllen TX',desc:'Farmacia y compras de emergencia.',lat:26.2020,lon:-98.2020,map:[232,341]},
{id:'outlet',name:'Rio Grande Valley Premium Outlets',cat:'Extra',icon:'🏷️',zone:'Mercedes',query:'Rio Grande Valley Premium Outlets, Mercedes, TX',desc:'Excursión separada: no la mezcles con McAllen salvo que amen manejar.',lat:26.1590,lon:-97.9180,map:[356,331]}
];
const routes={
  1:['hidalgo','ihopSouth','plaza','target','marshallsSouth','rossSouth','bestbuy','grand','whataburger','comfort'],
  2:['hobby','marshallsNorth','rossNorth','bestbuyNorth','imas','walmart','home2'],
  3:['outlet']
};
const defaultChecklist=['Pasaportes y visas vigentes','Documentos y seguro del vehículo','Revisar filas CBP antes de salir','Reservación del hotel','Roaming o datos en EE. UU.','Cargadores y batería portátil','Agua y snacks para los niños','Lista de tallas y encargos','Espacio disponible en la cajuela','Guardar tickets para cambios'];
const state={day:1,category:'Todos',deferredInstall:null,pendingImport:null,userLocation:null,gpsWatch:null,remoteResults:[],lastSearchAt:0};
