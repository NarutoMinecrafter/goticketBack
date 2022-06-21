import dotenv from 'dotenv'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const envFound = dotenv.config()

;(async () => {
  const { PORT } = process.env

  try {
    if (!envFound) {
      throw new Error('.env is not found')
    }

    const app = await NestFactory.create(AppModule)
    await app.listen(PORT, () => console.log(`🚀 Server has been started on port: ${PORT}...`))
  } catch (error) {
    console.log(`❌ Error: \n ${error}`)
  }
})()
