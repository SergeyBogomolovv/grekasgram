import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { v4 } from 'uuid';

@Injectable()
export class LinksService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async generateLink(userId: string) {
    const link = v4();
    await this.cache.set(link, { userId });
    return link;
  }

  async confirmLink(link: string) {
    const userId = (await this.cache.get<{ userId: string }>(link))?.userId;
    await this.cache.del(link);
    return userId;
  }
}
