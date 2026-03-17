const fs = require('fs');
const path = require('path');

const nichos = [
    { prefix: 'Restaurante', path: '../Restaurantes/prospectos_restaurantes_merida.csv', linkDemo: 'https://demo-restaurantes-mid.surge.sh' },
    { prefix: 'Belleza', path: '../Salones_Belleza/prospectos_belleza_merida.csv', linkDemo: 'https://demo-salones-mid.surge.sh' },
    { prefix: 'Taller', path: '../Talleres_Mecanicos/prospectos_talleres_merida.csv', linkDemo: 'https://demo-talleres-mid.surge.sh' },
    { prefix: 'Gimnasio', path: '../Gimnasios/prospectos_gimnasios_merida.csv', linkDemo: 'https://demo-gimnasios-mid.surge.sh' }
];

let crmContent = 'Nombre,Teléfono,Nicho,Punto Crítico Detectado,Beneficio Entregado,Link del Demo,Estatus en Embudo (CRM),Notas de Seguimiento,Link Búsqueda Google Maps\n';
let total = 0;

nichos.forEach(nicho => {
   const fullPath = path.join(__dirname, nicho.path);
   if(fs.existsSync(fullPath)){
      const data = fs.readFileSync(fullPath, 'utf8');
      const lines = data.split('\n');
      
      for(let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if(!line.trim()) continue; 
          
          const parts = line.split(',');
          let nombre = parts[0] ? parts[0].replace(/"/g, '').trim() : '';
          let telRaw = parts[1] ? parts[1].trim() : '';
          let problema = parts[3] ? parts[3].replace(/"/g, '').trim() : '';
          let beneficio = parts[4] ? parts[4].replace(/"/g, '').trim() : '';
          
          let tel = telRaw.replace(/\D/g, ''); 
          if(tel === '' || telRaw.toLowerCase().includes('disponible')) continue;
          if(tel.length === 10) tel = '52' + tel;
          
          // Generar una URL teórica para Maps
          const queryMaps = encodeURIComponent(`${nombre} Mérida Yucatán`);
          const linkMaps = `https://www.google.com/maps/search/?api=1&query=${queryMaps}`;
          
          // Columnas CRM: Estatus por defecto "1. Lead Frío (Falta Contactar)"
          const estatus = "1. Lead Frío";
          const notas = "-";
          
          // Escapar comas dentro del texto envolviéndolo en comillas
          crmContent += `"${nombre}","${tel}","${nicho.prefix}","${problema}","${beneficio}","${nicho.linkDemo}","${estatus}","${notas}","${linkMaps}"\n`;
          total++;
      }
   }
});

fs.writeFileSync(path.join(__dirname, 'CRM_Maestro_Antigravity.csv'), crmContent);
console.log(`✅ CRM Creado Exitosamente: CRM_Maestro_Antigravity.csv con ${total} clientes.`);
