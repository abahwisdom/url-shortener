import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlModule } from './url/url.module';
import { Url } from './url/url.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'urlshortener.db',
      entities: [Url],
      synchronize: true,
    }),
    UrlModule,
  ],
})
export class AppModule {}
