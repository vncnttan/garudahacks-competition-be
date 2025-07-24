import { PrismaClient } from '../generated/prisma'
const prisma = new PrismaClient()
async function main() {
  const language = await prisma.language.createMany({
    data: [
        {
            languageCode: 'jv',
            languageName: 'Javanese',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            languageCode: 'su',
            languageName: 'Sundanese',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            languageCode: 'id',
            languageName: 'Indonesian',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],

  })


 
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })