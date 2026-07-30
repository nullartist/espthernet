'use strict';
const APP_VERSION='3.0.0';
const root=r=>typeof r==='string'?document.querySelector(r):r;
const $=(s,r=document)=>root(r).querySelector(s), $$=(s,r=document)=>[...root(r).querySelectorAll(s)];
const store={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const mapUrl=q=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const wazeUrl=q=>`https://www.waze.com/ul?q=${encodeURIComponent(q)}&navigate=yes`;
const directionsUrl=ids=>{const ps=ids.map(id=>spots.find(p=>p.id===id)).filter(Boolean);if(ps.length<2)return mapUrl(ps[0]?.query||'McAllen TX');const origin=encodeURIComponent(ps[0].query),destination=encodeURIComponent(ps.at(-1).query),waypoints=encodeURIComponent(ps.slice(1,-1).map(p=>p.query).join('|'));return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;};
const spots=[
{id:'hidalgo',name:'Puente Internacional Hidalgo',cat:'Cruce',icon:'🌉',zone:'Frontera',query:'Hidalgo International Bridge, Hidalgo, TX',desc:'Abierto 24 horas; respaldo flexible para llegar al sur de McAllen.'},
{id:'anzalduas',name:'Puente Internacional Anzaldúas',cat:'Cruce',icon:'🌉',zone:'Frontera',query:'Anzalduas International Bridge, Mission, TX',desc:'Abre de 06:00 a 22:00; buena alternativa cuando la fila sea menor.'},
{id:'pharrbridge',name:'Puente Internacional Pharr',cat:'Cruce',icon:'🌉',zone:'Frontera',query:'Pharr-Reynosa International Bridge, Pharr, TX',desc:'Úsalo sólo cuando coincida la ventana de pasajeros y la espera convenga.'},
{id:'comfort',name:'Comfort Inn & Suites Pharr–McAllen',cat:'Hotel',icon:'🏨',zone:'Pharr',query:'Comfort Inn & Suites Pharr McAllen, 2706 N Cage Blvd, Pharr, TX',desc:'Base práctica cerca de Cage/Expressway, con desayuno incluido.'},
{id:'home2',name:'Home2 Suites by Hilton McAllen',cat:'Hotel',icon:'🏨',zone:'Convention Center',query:'Home2 Suites by Hilton McAllen, 525 S Ware Rd, McAllen, TX',desc:'Suites con cocina, desayuno caliente y mejor comodidad con niños.'},
{id:'plaza',name:'La Plaza Mall',cat:'Compras',icon:'🏬',zone:'Sur',query:'La Plaza Mall, 2200 S 10th St, McAllen, TX',desc:'Centro comercial principal; dale su propio bloque de tiempo.'},
{id:'target',name:'Target McAllen',cat:'Compras',icon:'🎯',zone:'Expressway/Jackson',query:'Target, 708 E Expressway 83, McAllen, TX',desc:'Encargos generales, farmacia CVS, Starbucks y Drive Up.'},
{id:'marshallsSouth',name:'Marshalls Expressway',cat:'Compras',icon:'🛍️',zone:'Expressway/Jackson',query:'Marshalls, 900 E Expressway 83, McAllen, TX',desc:'La sucursal sur encaja perfecto con Target y Ross.'},
{id:'rossSouth',name:'Ross Dress for Less Expressway',cat:'Compras',icon:'👗',zone:'Expressway/Jackson',query:'Ross Dress for Less, 620 E Expressway 83, McAllen, TX',desc:'Ropa y hogar; conviene llegar temprano para mejor selección.'},
{id:'bestbuy',name:'Best Buy Jackson',cat:'Compras',icon:'💻',zone:'Expressway/Jackson',query:'Best Buy, 700 S Jackson Rd, McAllen, TX',desc:'La sucursal que mejor se integra a la ruta sur.'},
{id:'walmart',name:'Walmart Supercenter Jackson',cat:'Compras',icon:'🛒',zone:'Expressway/Jackson',query:'Walmart Supercenter, 1200 E Jackson Ave, McAllen, TX',desc:'Básicos, compras finales y horario amplio.'},
{id:'grand',name:'Grand China Buffet',cat:'Comida',icon:'🥡',zone:'Pharr/Jackson',query:'Grand China Buffet, 500 N Jackson Rd, Pharr, TX',desc:'Imperdible familiar y muy cerca del corredor Jackson.'},
{id:'whataburger',name:'Whataburger Jackson',cat:'Comida',icon:'🥤',zone:'Expressway/Jackson',query:'Whataburger, 1412 E Jackson Ave, McAllen, TX',desc:'Parada oficial para malteadas; la ciencia aún estudia por qué son necesarias.'},
{id:'ihopSouth',name:'IHOP Sur',cat:'Comida',icon:'🥞',zone:'Sur',query:'IHOP, 1900 S 10th St, McAllen, TX',desc:'Desayuno/cena cerca de La Plaza y el aeropuerto.'},
{id:'hobby',name:'Hobby Lobby Trenton Crossing',cat:'Compras',icon:'🎨',zone:'Norte/Trenton',query:'Hobby Lobby, 7600 N 10th St Bldg 300, McAllen, TX',desc:'Combínalo con Marshalls, Ross y Best Buy North; cierra los domingos.'},
{id:'marshallsNorth',name:'Marshalls North McAllen',cat:'Compras',icon:'🛍️',zone:'Norte/Trenton',query:'Marshalls, 7600 N 10th St, McAllen, TX',desc:'Mismo corredor de Hobby Lobby y Ross.'},
{id:'rossNorth',name:'Ross North McAllen',cat:'Compras',icon:'👗',zone:'Norte/Trenton',query:'Ross Dress for Less, 7600 N 10th St, McAllen, TX',desc:'Útil si prefieren concentrar las tiendas de descuento al norte.'},
{id:'bestbuyNorth',name:'Best Buy North McAllen',cat:'Compras',icon:'💻',zone:'Norte/Trenton',query:'Best Buy, 8012 N 10th St, McAllen, TX',desc:'Alternativa si el día norte incluye electrónica.'},
{id:'imas',name:'International Museum of Art & Science',cat:'Niños',icon:'🦖',zone:'Norte',query:'IMAS McAllen, 1900 W Nolana Ave, McAllen, TX',desc:'Pausa con niños para cortar la maratón de tiendas.'},
{id:'quinta',name:'Quinta Mazatlán',cat:'Niños',icon:'🌿',zone:'Sur',query:'Quinta Mazatlan, 600 Sunset Dr, McAllen, TX',desc:'Jardines y naturaleza cerca de La Plaza; descanso breve y agradable.'},
{id:'heb',name:'H‑E‑B Plus! Pharr',cat:'Esenciales',icon:'🥑',zone:'Pharr',query:'H-E-B Plus, 1300 S Cage Blvd, Pharr, TX',desc:'Despensa y básicos cerca de la base en Pharr.'},
{id:'walgreens',name:'Walgreens Jackson',cat:'Esenciales',icon:'💊',zone:'Jackson',query:'Walgreens near Jackson Rd McAllen TX',desc:'Farmacia y compras de emergencia.'},
{id:'outlet',name:'Rio Grande Valley Premium Outlets',cat:'Extra',icon:'🏷️',zone:'Mercedes',query:'Rio Grande Valley Premium Outlets, Mercedes, TX',desc:'Excursión separada: no la mezcles con McAllen salvo que amen manejar.'}
];
const routes={
  1:['hidalgo','ihopSouth','plaza','target','marshallsSouth','rossSouth','bestbuy','grand','whataburger','comfort'],
  2:['hobby','marshallsNorth','rossNorth','bestbuyNorth','imas','walmart','home2'],
  3:['outlet']
};
const defaultChecklist=['Pasaportes y visas vigentes','Documentos y seguro del vehículo','Revisar filas CBP antes de salir','Reservación del hotel','Roaming o datos en EE. UU.','Cargadores y batería portátil','Agua y snacks para los niños','Lista de tallas y encargos','Espacio disponible en la cajuela','Guardar tickets para cambios'];
const state={day:1,category:'Todos',deferredInstall:null,pendingImport:null};
