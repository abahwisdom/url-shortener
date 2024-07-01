import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UrlController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/encode (POST)', () => {
    return request(app.getHttpServer())
      .post('/encode')
      .send({ longUrl: 'https://example.com' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('shortUrl');
      });
  });

  it('/decode (POST)', async () => {
    const encodeResponse = await request(app.getHttpServer())
      .post('/encode')
      .send({ longUrl: 'https://example.com' })
      .expect(201);

    const shortUrl = encodeResponse.body.shortUrl.split('/').pop();

    return request(app.getHttpServer())
      .post('/decode')
      .send({ shortUrl })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('longUrl', 'https://example.com');
      });
  });

  it('/statistic/:urlPath (GET)', async () => {
    const encodeResponse = await request(app.getHttpServer())
      .post('/encode')
      .send({ longUrl: 'https://example.com' })
      .expect(201);

    const urlPath = encodeResponse.body.shortUrl.split('/').pop();

    return request(app.getHttpServer())
      .get(`/statistic/${urlPath}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('longUrl', 'https://example.com');
        expect(res.body).toHaveProperty('visits', 0);
      });
  });

  it('/:urlPath (GET)', async () => {
    const encodeResponse = await request(app.getHttpServer())
      .post('/encode')
      .send({ longUrl: 'https://example.com' })
      .expect(201);

    const urlPath = encodeResponse.body.shortUrl.split('/').pop();

    return request(app.getHttpServer())
      .get(`/${urlPath}`)
      .expect(302)
      .expect('Location', 'https://example.com');
  });
});