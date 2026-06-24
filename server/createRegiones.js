const { PrismaClient } = require('./src/generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv/config');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const REGIONES = [
  { Codigo: '01', Descripcion: 'I- Tarapacá' },
  { Codigo: '02', Descripcion: 'II- Antofagasta' },
  { Codigo: '03', Descripcion: 'III- Atacama' },
  { Codigo: '04', Descripcion: 'IV- Coquimbo' },
  { Codigo: '05', Descripcion: 'V- Valparaíso' },
  { Codigo: '06', Descripcion: 'VI- Libertador G.B.O' },
  { Codigo: '07', Descripcion: 'VII- Maule' },
  { Codigo: '08', Descripcion: 'VIII- Biobío' },
  { Codigo: '09', Descripcion: 'IX- Araucanía' },
  { Codigo: '10', Descripcion: 'X- De los Lagos' },
  { Codigo: '11', Descripcion: 'XI- Aisén del Gral C' },
  { Codigo: '12', Descripcion: 'XII- Magallanes y A.' },
  { Codigo: '13', Descripcion: 'RM- Metropolitana' },
  { Codigo: '14', Descripcion: 'XIV- De los Ríos' },
  { Codigo: '15', Descripcion: 'XV- Arica y Parinacota' },
  { Codigo: '16', Descripcion: 'XVI- Del Ñuble' },
];

async function main() {
  for (const region of REGIONES) {
    await prisma.sapRegion.upsert({
      where: { Codigo: region.Codigo },
      update: { Descripcion: region.Descripcion },
      create: region,
    });
  }
  console.log('Regiones cargadas OK');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());