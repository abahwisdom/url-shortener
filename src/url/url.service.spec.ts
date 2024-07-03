import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './url.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
// import { nanoid } from 'nanoid';
// import { normalizeUrl } from 'src/utils/url.utils';

jest.mock("nanoid", () => {   return { nanoid: () => "abc123" } })

describe('UrlService', () => {
  let service: UrlService;
  let repository: Repository<Url>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(Url),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    repository = module.get<Repository<Url>>(getRepositoryToken(Url));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encode', () => {
    it('should throw BadRequestException if the URL is invalid', async () => {
      await expect(service.encode('invalid-url')).rejects.toThrow(BadRequestException);
    });

    it('should return existing short URL if the long URL is already encoded', async () => {
      const longUrl = 'https://example.com';
      const urlCode = 'abc123';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue({ longUrl, urlCode } as Url);

      const result = await service.encode(longUrl);
      expect(result).toBe(`${(process.env.BASE_PATH || "http://localhost:3000")}/${urlCode}`);
    });

    it('should create a new short URL if the long URL is not encoded', async () => {
      const longUrl = 'https://example.com';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue({} as Url);
      jest.spyOn(repository, 'save').mockResolvedValue({} as Url);

      const result = await service.encode(longUrl);
      expect(result).toBe(`${(process.env.BASE_PATH || "http://localhost:3000")}/abc123`);
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      const longUrl = 'https://example.com';
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(new Error());

      await expect(service.encode(longUrl)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('decode', () => {
    it('should throw BadRequestException if urlCode is not provided', async () => {
      await expect(service.decode('')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if the short URL is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.decode('abc123')).rejects.toThrow(NotFoundException);
    });

    it('should return the long URL if the short URL is found', async () => {
      const longUrl = 'https://example.com';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue({ longUrl } as Url);

      const result = await service.decode('abc123');
      expect(result).toBe(longUrl);
    });
  });

  describe('getStatistics', () => {
    it('should return the statistics for a given URL path', async () => {
      const longUrl = 'https://example.com';
      const visits = 5;
      const creationDate = new Date();
      const clicksByDate = { '2023-10-01': 3 };
      const mockUrl: Url = { id: 1, urlCode: 'abc123', longUrl, visits, creationDate, clicksByDate } as Url;
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUrl);

      const result = await service.getStatistics('abc123');
      expect(result).toEqual({ longUrl, visits, creationDate, clicksByDate });
    });

    it('should throw NotFoundException if the URL path is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.getStatistics('abc123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('incrementVisits', () => {
    it('should increment the visit count for a given URL path', async () => {
      const url = { visits: 5, clicksByDate: {} } as Url;
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(url);
      jest.spyOn(repository, 'save').mockResolvedValue({} as Url);

      await service.incrementVisits('abc123');
      expect(url.visits).toBe(6);
    });

    it('should update clicksByDate for the current date', async () => {
      const today = new Date().toISOString().split('T')[0];
      const url = { visits: 5, clicksByDate: {} } as Url;
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(url);
      jest.spyOn(repository, 'save').mockResolvedValue({} as Url);

      await service.incrementVisits('abc123');
      expect(url.clicksByDate[today]).toBe(1);
    });

    it('should throw NotFoundException if the URL path is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.incrementVisits('abc123')).rejects.toThrow(NotFoundException);
    });
  });
});
