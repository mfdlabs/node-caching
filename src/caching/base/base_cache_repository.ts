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

import BaseCacheItem from './base_cache_item';
import * as cacheConstants from '../cache_constants';

import logger from '@mfdlabs/logging';

/*
	File Name: base_cache_repository.ts
	Written by: Nikita Petko
*/

/**
 * Defines the abstract base class for cache repositories.
 *
 * Inherited classes must implement the following methods:
 * - _constructCacheItem (implements CacheItem.get, CacheItem.getAsync, CacheItem.isExpired, CacheItem.set, CacheItem.setAsync, CacheItem.delete, CacheItem.deleteAsync)
 *
 * Optionally, inherited classes can implement the following methods:
 * - _onSet + _onSetAsync
 * - _onDelete + _onDeleteAsync
 * - _onClear + _onClearAsync
 */
export default abstract class BaseCacheRepository {
  private readonly _cacheItems: Map<string, BaseCacheItem> = new Map<string, BaseCacheItem>();

  /**
   * Constructs a new BaseCacheRepository instance
   * @param {string} name The name of the cache repository
   * @param {number?} slidingExpiration The sliding expiration time in milliseconds
   * @param {Date?} absoluteExpiration The absolute expiration date
   * @param {boolean?} autoClearExpiredItems Whether to automatically clear expired cache items
   * @param {number?} autoClearExpiredItemsInterval The interval in milliseconds to automatically clear expired cache items
   * @param {logger?} logger The logger to use
   */
  public constructor(
    public name: string,
    public slidingExpiration: number = cacheConstants.defaultSlidingExpirationTime,
    public absoluteExpiration?: Date,
    public autoClearExpiredItems: boolean = true,
    public autoClearExpiredItemsInterval: number = 60000,
    protected readonly logger?: logger,
  ) {
    if (this.autoClearExpiredItems) {
      const timer = setInterval(() => {
        this.clearExpiredItems();
      }, this.autoClearExpiredItemsInterval);

      this.logger?.debug(
        'Auto clearing expired cache items for cache repository %s every %dms',
        this.name,
        this.autoClearExpiredItemsInterval,
      );

      // Clear the timer when the process exits
      process.on('exit', () => {
        clearInterval(timer);
      });
    }

    this.logger?.debug(
      'Created cache repository %s with sliding expiration %s and absolute expiration %s',
      this.name,
      this.slidingExpiration === cacheConstants.noExpirationTime ? 'None' : this.slidingExpiration + 'ms',
      this.absoluteExpiration?.toISOString() ?? 'None',
    );
  }

  /**
   * Override the toString method
   * @returns {string} The name of the cache repository
   */
  public toString(): string {
    return this.name;
  }

  private _calculateTtl(slidingExpiration?: number, absoluteExpiration?: Date): number | undefined {
    if (absoluteExpiration) {
      return absoluteExpiration.getTime();
    } else if (slidingExpiration) {
      return Date.now() + slidingExpiration;
    } else {
      if (this.absoluteExpiration) {
        return this.absoluteExpiration.getTime();
      }
      if (this.slidingExpiration) {
        return Date.now() + this.slidingExpiration;
      }

      return cacheConstants.noExpirationTime;
    }
  }

  /**
   * Get a cache item by key
   * @param {string} key The key of the cache item
   * @returns {BaseCacheItem | undefined} The cache item, or undefined if the cache item does not exist
   */
  protected _getCacheItem(key: string): BaseCacheItem | undefined {
    return this._cacheItems.get(key);
  }

  /**
   * Constructs a new CacheItem instance
   * @param {string} key The key of the cache item
   * @param {number?} ttl The time to live of the cache item
   * @returns {BaseCacheItem} The constructed CacheItem instance
   */
  protected abstract _constructCacheItem(key: string, ttl?: number): BaseCacheItem;

  /**
   * Invoked when a cache item is set
   * @template T The type of the cache item
   * @param {string} key The key of the cache item
   * @param {T} value The value of the cache item
   * @param {number?} ttl The time to live of the cache item
   */
  protected _onSet?<T = any>(key: string, value: T, ttl?: number): void;

  /**
   * Invoked when a cache item is set asynchronously
   * @template T The type of the cache item
   * @param {string} key The key of the cache item
   * @param {T} value The value of the cache item
   * @param {number?} ttl The time to live of the cache item
   * @returns {Promise<void>}
   */
  protected _onSetAsync?<T = any>(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * Invoked when a cache item is deleted
   * @param {string} key The key of the cache item
   * @returns {void}
   */
  protected _onDelete?(key: string): void;

  /**
   * Invoked when a cache item is deleted asynchronously
   * @param {string} key The key of the cache item
   * @returns {Promise<void>}
   */
  protected _onDeleteAsync?(key: string): Promise<void>;

  /**
   * Invoked when the cache repository is cleared
   * @returns {void}
   */
  protected _onClear?(): void;

  /**
   * Invoked when the cache repository is cleared asynchronously
   * @returns {Promise<void>}
   */
  protected _onClearAsync?(): Promise<void>;

  /**
   * Clears all expired cache items
   * @returns {void}
   */
  public clearExpiredItems(): void {
    for (const [key, cacheItem] of this._cacheItems) {
      if (cacheItem.isExpired()) {
        this.logger?.debug('Cache item %s has expired, deleting...', key);

        cacheItem.delete();

        this._cacheItems.delete(key);
      }
    }
  }

  /**
   * Get the value of a cache item
   * @template T The type of the cache item
   * @param {string} key The key of the cache item
   * @returns {T} The value of the cache item
   */
  public get<T = any>(key: string): T | undefined {
    this.logger?.debug('Getting cache item %s...', key);

    this.clearExpiredItems();

    return this._getCacheItem(key)?.get();
  }

  /**
   * Gets a value of a cache item asynchronously
   * @template T The type of the cache item
   * @param {string} key The key of the cache item
   * @returns {Promise<T>} The value of the cache item
   * @async
   */
  public getAsync<T = any>(key: string): Promise<T | undefined> {
    this.logger?.debug('Getting cache item %s asynchronously...', key);

    this.clearExpiredItems();

    return this._getCacheItem(key)?.getAsync();
  }

  /**
   * Set a cache item
   * @template T The type of the cache item
   * @param {string} key The key of the cache item
   * @param {T} value The value of the cache item
   * @param {number?} ttl The time to live of the cache item
   * @returns {T} The value of the cache item
   */
  public set<T = any>(key: string, value: T, ttl?: number): T {
    this.logger?.debug('Setting cache item %s...', key);

    let cacheItem = this._getCacheItem(key);

    if (cacheItem) {
      this.logger?.debug('Cache item %s already exists, updating...', key);

      cacheItem.ttl = this._calculateTtl(ttl);

      cacheItem.set(value);

      this._onSet?.(key, value, ttl);

      return value;
    }

    cacheItem = this._constructCacheItem(key, this._calculateTtl(ttl));

    cacheItem.set(value);

    this._cacheItems.set(key, cacheItem);

    this._onSet?.(key, value, ttl);

    return value;
  }

  /**
   * Set a cache item asynchronously
   * @template T The type of the cache item
   * @param {string} key The key of the cache item
   * @param {T} value The value of the cache item
   * @param {number?} ttl The time to live of the cache item
   * @returns {Promise<T>} The value of the cache item
   * @async
   */
  public async setAsync<T = any>(key: string, value: T, ttl?: number): Promise<T> {
    this.logger?.debug('Setting cache item %s asynchronously...', key);

    let cacheItem = this._getCacheItem(key);

    if (cacheItem) {
      this.logger?.debug('Cache item %s already exists, updating...', key);

      cacheItem.ttl = this._calculateTtl(ttl);

      await cacheItem.setAsync(value);

      await this._onSetAsync?.(key, value, ttl);

      return value;
    }

    cacheItem = this._constructCacheItem(key, this._calculateTtl(ttl));

    await cacheItem.setAsync(value);

    this._cacheItems.set(key, cacheItem);

    await this._onSetAsync?.(key, value, ttl);

    return value;
  }

  /**
   * Delete a cache item
   * @param {string} key The key of the cache item
   * @returns {void}
   */
  public delete(key: string): void {
    this.logger?.debug('Deleting cache item %s...', key);

    const cacheItem = this._getCacheItem(key);

    if (cacheItem) {
      cacheItem.delete();

      this._cacheItems.delete(key);

      this._onDelete?.(key);
    }
  }

  /**
   * Delete a cache item asynchronously
   * @param {string} key The key of the cache item
   * @returns {Promise<void>}
   */
  public async deleteAsync(key: string): Promise<void> {
    this.logger?.debug('Deleting cache item %s asynchronously...', key);

    const cacheItem = this._getCacheItem(key);

    if (cacheItem) {
      await cacheItem.deleteAsync();

      this._cacheItems.delete(key);

      await this._onDeleteAsync?.(key);
    }
  }

  /**
   * Clear the cache repository
   * @returns {void}
   */
  public clear(): void {
    this.logger?.debug('Clearing cache repository...');

    for (const [key, cacheItem] of this._cacheItems) {
      cacheItem.delete();

      this._cacheItems.delete(key);
    }

    this._onClear?.();
  }

  /**
   * Clear the cache repository asynchronously
   * @returns {Promise<void>}
   * @async
   */
  public async clearAsync(): Promise<void> {
    this.logger?.debug('Clearing cache repository asynchronously...');

    for (const [key, cacheItem] of this._cacheItems) {
      await cacheItem.deleteAsync();

      this._cacheItems.delete(key);
    }

    await this._onClearAsync?.();
  }

  /**
   * Get the number of cache items
   * @returns {number} The number of cache items
   * @readonly
   */
  public get size(): number {
    return this._cacheItems.size;
  }

  /**
   * Get the cache items
   * @returns {Map<string, any>} The cache items
   */
  public getCacheItems(): Map<string, any> {
    const cacheItems = new Map<string, any>();

    for (const [key, cacheItem] of this._cacheItems) {
      cacheItems.set(key, cacheItem.get());
    }

    return cacheItems;
  }

  /**
   * Get the cache items asynchronously
   * @returns {Promise<Map<string, any>>} The cache items
   * @async
   */
  public async getCacheItemsAsync(): Promise<Map<string, any>> {
    const cacheItems = new Map<string, any>();

    for (const [key, cacheItem] of this._cacheItems) {
      cacheItems.set(key, await cacheItem.getAsync());
    }

    return cacheItems;
  }
}
