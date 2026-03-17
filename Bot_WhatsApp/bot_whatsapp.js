const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

console.log('🤖 Iniciando Bot WhatsApp Avanzado (Conexión a CRM y Auto-Reportes)...');

const archivoCRM = 'CRM_Maestro_Antigravity.csv';
let prospectos = [];

// ========================================================
// 1. CARGA DINÁMICA DE PROSPECTOS DESDE EL CRM
// ========================================================
fs.createReadStream(archivoCRM)
  .pipe(csv())
  .on('data', (row) => {
      // Ignorar líneas vacías
      if (row.Nombre && row.Teléfono) {
          prospectos.push(row);
      }
  })
  .on('end', () => {
      console.log(`📊 CRM Cargado: Se encontraron ${prospectos.length} prospectos en espera.`);
      iniciarBot();
  });

// ========================================================
// 2. PLANTILLAS NEUROMARKETING (30% OFF)
// ========================================================
function generarMensaje(p) {
    const nombre = p.Nombre || 'Equipo';
    const link = p['Link del Demo'] || '';
    const nicho = p.Nicho ? p.Nicho.toLowerCase() : '';

    if (nicho.includes('restaurante')) {
        return `Hola equipo de ${nombre} 🍔. ¡Excelente día!

Soy desarrollador aquí en Mérida y, buscando dónde comer este fin de semana, noté que están perdiendo reservas y pedidos porque no tienen un menú interactivo en Google o redes.

Para mostrarles la solución, les programé de regalo un Prototipo Web con su propio Menú Digital y botón directo para pedir por WhatsApp (así se ahorran las altísimas comisiones de Rappi/Uber). 

Pueden probar cómo se vería desde su cel aquí:
👉 ${link}

Tenemos una promoción relámpago del 30% de descuento para restaurantes de la zona que quieran digitalizarse este mes. Si les interesa no perder más ventas frente a franquicias, mándenme un mensajito para platicar. ¡Saludos! ✌️`;
    } 
    else if (nicho.includes('belleza') || nicho.includes('spa')) {
        return `¡Hola equipo de ${nombre}! ✨ Sigo su trabajo y me encanta el estilo que traen.

Revisando su presencia online, me di cuenta de que su agenda de citas es 100% manual. Esto roba muchísimo tiempo a la recepcionista y genera pérdidas por las clientas que cancelan a última hora o no asisten.

Como soy especialista en software local, me adelanté y les diseñé su propio Demo de Agenda Inteligente. Sus clientas entran solas, ven servicios, eligen horario y reservan. Cero mensajes a las 11 PM. Chequen el demo en vivo aquí:
👉 ${link}

Ahorita tengo activo un 30% de descuento para digitalizar negocios de belleza este mes. Si les interesa automatizar su agenda y escalar sus ingresos, avísenme. ¡Éxito en sus citas hoy! 💅`;
    }
    else if (nicho.includes('taller')) {
        return `¡Qué tal dueños de ${nombre}! 🛠️🚘

Pasé cerca de ustedes hace unos días. Viendo cómo trabajan, noté que podrían captar muchos más a dueños de autos premium, pero les falta una página web oficial y moderna que genere confianza de inmediato.

Además de la web, sé que los clientes desesperan llamando para preguntar "¿Ya quedó mi carro?". Para matar ese problema, les armé un Simulador Web con un Portafolio de sus arreglos y un "Área de Estatus de Reparación en vivo":
👉 ${link}

Estoy dando un 30% de descuento a talleres locales que quieran separar su marca de la competencia este mes. Abran el link, pruébenlo y si les hace sentido ganar clientes más formales, me avisan. 🤝`;
    }
    else if (nicho.includes('gimnasio') || nicho.includes('crossfit')) {
        return `💪🏼 ¡Qué buena energía traen en ${nombre}! 

Me percaté de que todavía gestionan las reservas de clases y mensualidades de forma manual por Instagram o WhatsApp. Eso frena su crecimiento y causa sobrecupos.

Me dedico a crear plataformas deportivas y me tomé la libertad de hacerles un demo funcional. Es una Landing Page donde sus atletas pueden suscribirse online y apartar su hora/espacio para el WOD/Clases sin tener que escribirles. Véanlo funcionando aquí:
👉 ${link}

Tengo un bono del 30% OFF directo en costos de desarrollo para gimnasios este mes. Si quieren profesionalizar sus cobros y membresías (estilo Netflix), échenme un mensaje y platicamos 10 minutos. ¡Saludos de un colega local! 🏋️‍♂️`;
    }
    else {
        // Genérico si el nicho no coincide exacto
        return `¡Hola equipo de ${nombre}! 👋 Excelente día.
        
Revisando su negocio en Maps, noté un área de oportunidad gigante porque no tienen un catálogo o sitio web oficial. Desarrollé un Prototipo Web para ustedes de regalo, para que puedan recibir ventas y cotizaciones directas a WhatsApp. Pueden probarlo aquí:
👉 ${link}
        
Por temporada tengo una bonificación del 30% para negocios que quieran dar el salto digital este mes. Si les interesa automatizar sus ventas, sigo a sus órdenes. ¡Éxito hoy!`;
    }
}

// FORMATO CSV PARA LOS REPORTES FINALES
const crearLineaCSV = (p) => `"${p.Nombre}","${p.Teléfono}","${p.Nicho}","${p.Estatus}","${p['Link Búsqueda Google Maps']}"\n`;

// ========================================================
// 3. LÓGICA DEL BOT Y ESCUDO ANTI-BAN
// ========================================================
function iniciarBot() {
    const client = new Client({
        authStrategy: new LocalAuth(), 
        puppeteer: { 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', (qr) => {
        console.log('\n📱 ESCANEA ESTE CÓDIGO QR CON TU WHATSAPP PERSONAL');
        qrcode.generate(qr, {small: true});
    });

    client.on('ready', () => {
        console.log('✅ ¡Señal conectada desde tu WhatsApp Personal!');
        console.log(`⚙️  Comenzando iteración de ${prospectos.length} prospectos...\n`);
        iniciarCampana(client);
    });

    client.initialize();
}

const esperarSegundos = (min, max) => {
    const tiempo = Math.floor(Math.random() * (max - min + 1) + min);
    return new Promise(resolve => setTimeout(resolve, tiempo * 1000));
};

async function iniciarCampana(client) {
    let exitososHeader = "Nombre,Telefono,Nicho,Estatus CRM,Link Maps\n";
    let fallidosHeader = "Nombre,Telefono,Nicho,Motivo de Falla,Link Maps\n";
    
    let exitososGenerados = exitososHeader;
    let fallidosGenerados = fallidosHeader;

    let enviadosContador = 0;
    let fallidosContador = 0;

    for (let i = 0; i < prospectos.length; i++) {
        const prospecto = prospectos[i];
        let telefonoBase = prospecto.Teléfono.replace(/\D/g, '');
        // Usamos el código de pais 52 limpio (sin 1)
        if(telefonoBase.startsWith('521')) { telefonoBase = telefonoBase.replace(/^521/, '52'); }
        if(telefonoBase.length === 10) { telefonoBase = '52' + telefonoBase; }

        console.log(`\n▶️ [${i+1}/${prospectos.length}] Analizando: ${prospecto.Nombre}...`);

        try {
            // Validar existencia real en WhatsApp (El Escudo)
            const validacion = await client.getNumberId(telefonoBase);
            
            if(!validacion) {
                console.log(`   ❌ Escudo: El número de ${prospecto.Nombre} es de contacto telefónico fijo (Casa/Oficina). Saltando.`);
                prospecto.Estatus = "Error: Sin WhatsApp";
                fallidosGenerados += crearLineaCSV(prospecto);
                fallidosContador++;
                continue;
            }
            
            const chatId = validacion._serialized;
            const mensajeFinal = generarMensaje(prospecto);

            // Simular humano "Escribiendo" e inyectar el mensaje
            await esperarSegundos(5, 12);
            await client.sendMessage(chatId, mensajeFinal);
            
            console.log(`   ✅ Link de Oferta enviado exitosamente a ${prospecto.Nombre}!`);
            prospecto.Estatus = "2. Demo Enviado";
            exitososGenerados += crearLineaCSV(prospecto);
            enviadosContador++;

            // Pausa de enfriamiento severa entre mensajes (Vital para no ser detectado de Spam)
            if(i < prospectos.length - 1) {
                const pausa = Math.floor(Math.random() * (55 - 35 + 1) + 35);
                console.log(`   ⏳ Tiempo anti-ban: Descansando ${pausa} segundos...`);
                await esperarSegundos(pausa, pausa);
            }

        } catch (error) {
            console.log(`   ⚠️ Falla de conexión con ${prospecto.Nombre}: `, error.message);
            prospecto.Estatus = "Error del Sistema";
            fallidosGenerados += crearLineaCSV(prospecto);
            fallidosContador++;
        }
    }
    
    // Al Finalizar: Guardar los 2 archivos Excel/CSV de resultados
    fs.writeFileSync('Enviados_Exitosos.csv', exitososGenerados);
    fs.writeFileSync('Prospectos_Fallidos.csv', fallidosGenerados);

    console.log(`\n🎉 CAMPAÑA B2B FINALIZADA.`);
    console.log(`📈 Resultados Extraídos:  Enviados [${enviadosContador}] | Fallidos/Fijos [${fallidosContador}]`);
    console.log(`📁 Revisa tus documentos: 'Enviados_Exitosos.csv' y 'Prospectos_Fallidos.csv' en la carpeta.`);
    process.exit(0);
}
