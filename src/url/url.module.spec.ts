import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlModule } from './url.module';
import { UrlService } from './url.service';
import { Url } from './url.entity';

describe('UrlModule', () => {
  let module: TestingModule;
  let service: UrlService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Url],
          synchronize: true,
        }),
        UrlModule,
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('UrlService should be defined', () => {
    expect(service).toBeDefined();
  });
});
