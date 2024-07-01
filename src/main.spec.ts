import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

describe('Main', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close(); // Properly close the application
  });

  it('should start the application', () => {
    expect(app).toBeDefined();
  });

  it('should listen on the default port', async () => {
    const port = process.env.PORT || 3000;
    await app.listen(port);
    expect(app.getHttpServer().listening).toBe(true);
  });
});