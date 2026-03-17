const fs = require('fs');
const path = require('path');

// Nomenclaturas y rutas
const nichos = [
    { prefix: 'RST', name: 'Restaurante', path: '../Restaurantes/prospectos_restaurantes_merida.csv' },
    { prefix: 'SPA', name: 'Belleza', path: '../Salones_Belleza/prospectos_belleza_merida.csv' },
    { prefix: 'TLL', name: 'Taller', path: '../Talleres_Mecanicos/prospectos_talleres_merida.csv' },
    { prefix: 'GYM', name: 'Gimnasio', path: '../Gimnasios/prospectos_gimnasios_merida.csv' }
];

let vcardContent = '';
let totalContactos = 0;

console.log('⏳ Leyendo archivos CSV de las base de datos...');

nichos.forEach(nicho => {
   const fullPath = path.join(__dirname, nicho.path);
   
   if(fs.existsSync(fullPath)){
      const data = fs.readFileSync(fullPath, 'utf8');
      const lines = data.split('\n');
      
      // Ignorar la cabecera (i=0)
      for(let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if(!line.trim()) continue; // Ignorar líneas en blanco
          
          const parts = line.split(',');
          // Formato del CSV: Nombre, Teléfono, Web, Punto Crítico...
          let nombre = parts[0] ? parts[0].replace(/"/g, '').trim() : '';
          let telRaw = parts[1] ? parts[1].trim() : '';
          
          // Limpiar el teléfono para dejar solo los números
          let tel = telRaw.replace(/\D/g, ''); 
          
          // Filtrar negocios sin teléfono
          if(tel === '' || telRaw.toLowerCase().includes('disponible')) {
              continue;
          }
          
          // Agregamos código lada si no lo tiene. Asumimos México (+52)
          if(tel.length === 10) {
              tel = '52' + tel;
          }
          
          // El estándar vCard requiere el signo de Más (+)
          if(!tel.startsWith('+')) {
              tel = '+' + tel;
          }
          
          // Formato exigido: CLT [NichoAbreviado] [Nombre]
          // Ejemplo: CLT RST La Burg
          const fullName = `CLT ${nicho.prefix} ${nombre}`;
          
          vcardContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${fullName}\nTEL;TYPE=CELL:${tel}\nEND:VCARD\n`;
          totalContactos++;
      }
   } else {
       console.log(`⚠️ Advertencia: No se encontró el archivo ${nicho.path}`);
   }
});

fs.writeFileSync(path.join(__dirname, 'contactos_masivos.vcf'), vcardContent);

console.log(`\n======================================================`);
console.log(`✅ ¡ÉXITO! Se han generado ${totalContactos} contactos.`);
console.log(`📁 Archivo creado: Bot_WhatsApp/contactos_masivos.vcf`);
console.log(`👉 Siguiente paso: Envía este archivo '.vcf' a tu correo o WhatsApp y ábrelo desde tu celular. ¡Se guardarán tus ${totalContactos} prospectos en 1 segundo con la etiqueta CLT!`);
console.log(`======================================================\n`);
