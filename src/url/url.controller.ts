import { Controller, Post, Body, Get, Param, Res, BadRequestException } from '@nestjs/common';
import { UrlService } from './url.service';
import { normalizeUrl } from 'src/utils/url.utils';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('encode')
  async encode(@Body('longUrl') longUrl: string) {
    const shortUrl = await this.urlService.encode(longUrl);
    return { shortUrl };
  }

  @Post('decode')
  async decode(@Body('shortUrl') shortUrl: string) {
    if (!shortUrl) {
      throw new BadRequestException('shortUrl must be provided');
    }
    const longUrl = await this.urlService.decode(shortUrl);
    return { longUrl };
  }

  @Get('statistic/:urlPath')
  async getStatistics(@Param('urlPath') urlPath: string) {
    const stats = await this.urlService.getStatistics(urlPath);
    return stats;
  }

 @Get(':urlPath')
  async redirect(@Param('urlPath') urlPath: string, @Res() res) {
    const longUrl = await this.urlService.decode(urlPath);
    await this.urlService.incrementVisits(urlPath);

    const redirectUrl = normalizeUrl(longUrl);

    return res.redirect(redirectUrl);
  }
}
