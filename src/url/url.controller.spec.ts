import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: {
            encode: jest.fn(),
            decode: jest.fn(),
            getStatistics: jest.fn(),
            incrementVisits: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('encode', () => {
    it('should return a short URL', async () => {
      const longUrl = 'https://example.com';
      const shortUrl = 'http://short.url/abc123';
      jest.spyOn(service, 'encode').mockResolvedValue(shortUrl);

      const result = await controller.encode(longUrl);
      expect(result).toEqual({ shortUrl });
    });

    it('should throw BadRequestException if the URL is invalid', async () => {
      jest.spyOn(service, 'encode').mockRejectedValue(new BadRequestException());

      await expect(controller.encode('invalid-url')).rejects.toThrow(BadRequestException);
    });
  });

  describe('decode', () => {
    it('should return the long URL', async () => {
      const shortUrl = 'abc123';
      const longUrl = 'https://example.com';
      jest.spyOn(service, 'decode').mockResolvedValue(longUrl);

      const result = await controller.decode(shortUrl);
      expect(result).toEqual({ longUrl });
    });

    it('should throw BadRequestException if shortUrl is not provided', async () => {
      await expect(controller.decode('')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if the short URL is not found', async () => {
      jest.spyOn(service, 'decode').mockRejectedValue(new NotFoundException());

      await expect(controller.decode('abc123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStatistics', () => {
    it('should return the statistics for a given URL path', async () => {
      const urlPath = 'abc123';
      const stats = { longUrl: 'https://example.com', visits: 5, creationDate: new Date(), clicksByDate: { '2023-10-01': 3 } };
      jest.spyOn(service, 'getStatistics').mockResolvedValue(stats);

      const result = await controller.getStatistics(urlPath);
      expect(result).toEqual(stats);
    });

    it('should throw NotFoundException if the URL path is not found', async () => {
      jest.spyOn(service, 'getStatistics').mockRejectedValue(new NotFoundException());

      await expect(controller.getStatistics('abc123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('redirect', () => {
    it('should redirect to the long URL', async () => {
      const urlPath = 'abc123';
      const longUrl = 'https://example.com';
      jest.spyOn(service, 'decode').mockResolvedValue(longUrl);
      jest.spyOn(service, 'incrementVisits').mockResolvedValue();

      const res = {
        redirect: jest.fn(),
      };

      await controller.redirect(urlPath, res as any);
      expect(res.redirect).toHaveBeenCalledWith(longUrl);
    });

    it('should throw NotFoundException if the short URL is not found', async () => {
      jest.spyOn(service, 'decode').mockRejectedValue(new NotFoundException());

      const res = {
        redirect: jest.fn(),
      };

      await expect(controller.redirect('abc123', res as any)).rejects.toThrow(NotFoundException);
    });
  });
});