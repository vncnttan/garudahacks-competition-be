import { hash } from 'bcrypt'
import { PrismaClient } from '../node_modules/.prisma/client'
const prisma = new PrismaClient()
async function main() {

  const hashedPassword = await hash('admin', 10)

  const user = await prisma.user.create({
    data: {
        username: 'admin',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
    } 
  })

  const languages = await prisma.language.createMany({
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

  const languageJv = await prisma.language.findFirst({
    where: {
        languageCode: 'jv'
    }
  })

  const languageSu = await prisma.language.findFirst({
    where: {
        languageCode: 'su'
    }
  })

  const languageId = await prisma.language.findFirst({
    where: {
        languageCode: 'id'
    }
  })



  const word = await prisma.word.createMany({
    data: [
      {
        word: 'Mangan',
        definition: 'Kegiatan mengkonsumsi makanan, bentuk umum dalam bahasa Jawa.',
        example: 'Aku arep mangan pecel.',
        exampleTranslation: 'Aku mau makan pecel.',
        examplePronounciation: '/public/examplePronunciation-mangan.mp3',
        pronounciation: '/public/pronunciation-mangan.mp3',
        directTranslation: ['Makan'],
        languageId: languageJv!.id,
        createdById: user.id,
      },
      {
        word: 'Nedha',
        definition: 'Bentuk halus (krama) dari "mangan", biasa dipakai untuk menghormati orang lain.',
        example: 'Bapak sampun nedha?',
        exampleTranslation: 'Apakah Bapak sudah makan?',
        examplePronounciation: '/public/examplePronunciation-nedha.mp3',
        pronounciation: '/public/pronunciation-nedha.mp3',
        directTranslation: ['Makan'],
        languageId: languageJv!.id,
        createdById: user.id,
      },
      {
        word: 'Dhahar',
        definition: 'Bentuk sangat sopan atau halus untuk "makan", sering digunakan dalam krama inggil.',
        example: 'Njenengan sampun dhahar?',
        exampleTranslation: 'Apakah Anda sudah makan?',
        examplePronounciation: '/public/examplePronunciation-dhahar.mp3',
        pronounciation: '/public/pronunciation-dhahar.mp3',
        directTranslation: ['Makan'],
        languageId: languageJv!.id,
        createdById: user.id,
      },
      {
        word: 'Turu',
        definition: 'Beristirahat atau tidur.',
        example: 'Aku arep turu sek.',
        exampleTranslation: 'Aku mau tidur dulu.',
        examplePronounciation: '/public/examplePronunciation-turu.mp3',
        pronounciation: '/public/pronunciation-turu.mp3',
        directTranslation: ['Tidur'],
        languageId: languageJv!.id,
        createdById: user.id,
      },
      {
        word: 'Ngombe',
        definition: 'Minum sesuatu, biasanya air atau minuman lainnya.',
        example: 'Aku ngombe es teh.',
        exampleTranslation: 'Aku minum es teh.',
        examplePronounciation: '/public/examplePronunciation-ngombe.mp3',
        pronounciation: '/public/pronunciation-ngombe.mp3',
        directTranslation: ['Minum'],
        languageId: languageJv!.id,
        createdById: user.id,
      }
    ]
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