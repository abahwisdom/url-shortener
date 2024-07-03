import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { isURL } from 'class-validator';
import { nanoid } from 'nanoid';
import { normalizeUrl } from 'src/utils/url.utils';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  private async findUrlByCode(urlCode: string): Promise<Url> {
    if (!urlCode) {
      throw new BadRequestException('Short URL must be provided');
    }

    const url = await this.urlRepository.findOneBy({ urlCode });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    return url;
  }

  async encode(longUrl: string): Promise<string> {
    if (!isURL(longUrl)) {
      throw new BadRequestException('String Must be a Valid URL');
    }

    try {
      const existingURL = await this.urlRepository.findOneBy({ longUrl: normalizeUrl(longUrl) });
      if (existingURL) {
        return `${(process.env.BASE_PATH || "http://localhost:3000")}/${existingURL.urlCode}`;
      }

      const urlCode = nanoid(10);
      const shortUrl = `${(process.env.BASE_PATH || "http://localhost:3000")}/${urlCode}`;
      const url = this.urlRepository.create({ urlCode, longUrl: normalizeUrl(longUrl), creationDate: new Date(), clicksByDate: {} });
      await this.urlRepository.save(url);

      return shortUrl;

    } catch (error) {
      throw new InternalServerErrorException('Failed to shorten URL');
    }
  }

  async decode(urlCode: string): Promise<string> {
    const url = await this.findUrlByCode(urlCode);
    return url.longUrl;
  }

  async getStatistics(urlPath: string): Promise<{ longUrl: string; visits: number; creationDate: Date; clicksByDate: Record<string, number> }> {
    const url = await this.findUrlByCode(urlPath);
    return { longUrl: url.longUrl, visits: url.visits, creationDate: url.creationDate, clicksByDate: url.clicksByDate };
  }

  async incrementVisits(urlPath: string): Promise<void> {
    const url = await this.findUrlByCode(urlPath);
    url.visits += 1;

    const today = new Date().toISOString().split('T')[0];
    if (!url.clicksByDate[today]) {
      url.clicksByDate[today] = 0;
    }
    url.clicksByDate[today] += 1;

    await this.urlRepository.save(url);
  }
}