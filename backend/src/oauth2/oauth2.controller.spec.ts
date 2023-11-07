import { Test, TestingModule } from '@nestjs/testing';
import { Oauth2Controller } from './oauth2.controller';
import { Oauth2Service } from './oauth2.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('Oauth2Controller', () => {
  let controller: Oauth2Controller;
  let service: Oauth2Service;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Oauth2Controller],
      providers: [
        { provide: Oauth2Service, useValue: { googleCallback: jest.fn() } },
      ],
    }).compile();

    controller = module.get<Oauth2Controller>(Oauth2Controller);
    service = module.get<Oauth2Service>(Oauth2Service);
    app = module.createNestApplication();
    await app.init();
  });
  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /oauth2/google/callback', () => {
    it('should redirect to the frontend URL with a token', async () => {
      const token = 'abc123';
      jest.spyOn(service, 'googleCallback').mockResolvedValue(token);

      const res = await request(app.getHttpServer())
        .get('/oauth2/google/callback')
        .query({ code: '123' })
        .expect(302);
      expect(service.googleCallback).toBeCalledWith('123');
      expect(res.header.location).toContain(`token=${token}`);
    });
  });
});
