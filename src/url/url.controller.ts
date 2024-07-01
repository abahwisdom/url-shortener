import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { UrlService } from './url.service';

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

    // Ensure the longUrl includes the protocol
    const isFullUrl = /^https?:\/\//i.test(longUrl);
    const redirectUrl = isFullUrl ? longUrl : `http://${longUrl}`;

    return res.redirect(redirectUrl);
  }
}
