import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { isURL } from 'class-validator';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  async encode(longUrl: string): Promise<string> {
    if (!isURL(longUrl)) {
        throw new BadRequestException('String Must be a Valid URL');
    }

    //check if the URL has already been shortened
    const existingURL = await this.urlRepository.findOneBy({ longUrl });
    //return it if it exists
    if (existingURL){ return `http://localhost:3000/${existingURL.urlCode}`  };

    const urlCode = nanoid(10);
    const shortUrl = `http://localhost:3000/${urlCode}`;

    const url = this.urlRepository.create({ urlCode, longUrl });
    await this.urlRepository.save(url);

    return shortUrl;
  }

  async decode(urlCode: string): Promise<string> {
    const url = await this.urlRepository.findOneBy({ urlCode });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    return url.longUrl;
  }

  async getStatistics(urlPath: string): Promise<{ longUrl: string; visits: number }> {
    const url = await this.urlRepository.findOneBy({ urlCode: urlPath });

    if (!url) {
      throw new NotFoundException('Statistics not found for this URL path');
    }

    return { longUrl: url.longUrl, visits: url.visits };
  }

  async incrementVisits(urlPath: string): Promise<void> {
    const url = await this.urlRepository.findOneBy({ urlCode: urlPath });

    if (url) {
      url.visits += 1;
      await this.urlRepository.save(url);
    }
  }
}
