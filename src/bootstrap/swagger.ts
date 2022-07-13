import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export default (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Go ticket')
    .setDescription('Go ticket REST API documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('/swagger', app, document)
}
