/*
   Copyright 2022 Nikita Petko <petko@vmminfra.net>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import FileSystemCacheItem from './file_system_cache_item';
import BaseCacheRepository from '../base/base_cache_repository';

import logger from '@mfdlabs/logging';

/*
	File Name: noop_cache_repository.ts
	Written by: Nikita Petko
*/

/**
 * A cache repository that stores cache items in the file system.
 */
export default class FileSystemCacheRepository extends BaseCacheRepository {
  /**
   * Constructs a new NoopCacheRepository instance
   * @param {string} name The name of the cache repository
   * @param {number?} slidingExpiration The sliding expiration time in milliseconds
   * @param {Date?} absoluteExpiration The absolute expiration date
   * @param {boolean?} autoClearExpiredItems Whether to automatically clear expired cache items
   * @param {number?} autoClearExpiredItemsInterval The interval in milliseconds to automatically clear expired cache items
   * @param {logger?} logger The logger to use
   */
  public constructor(
    name: string,
    slidingExpiration?: number,
    absoluteExpiration?: Date,
    autoClearExpiredItems?: boolean,
    autoClearExpiredItemsInterval?: number,
    logger?: logger,
  ) {
    super(name, slidingExpiration, absoluteExpiration, autoClearExpiredItems, autoClearExpiredItemsInterval, logger);
  }

  /**
   * Constructs a new CacheItem instance
   * @param {string} key The key of the cache item
   * @param {number?} ttl The time to live of the cache item
   * @returns {cacheItem} The constructed CacheItem instance
   */
  protected _constructCacheItem(key: string, ttl?: number): FileSystemCacheItem {
    return new FileSystemCacheItem(key, ttl);
  }
}
