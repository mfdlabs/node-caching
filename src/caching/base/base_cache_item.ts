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

/*
	File Name: cache_item.ts
	Written by: Nikita Petko
*/

import * as cacheConstants from '../cache_constants';

/**
 * CacheItem implementation.
 *
 * Inherited classes must implement the following methods:
 * - get + getAsync
 * - isExpired
 * - persist + persistAsync
 * - delete + deleteAsync
 */
export default abstract class BaseCacheItem {
  /**
   * Constructs a new CacheItem instance
   * @param {string} key The key of the cache item
   * @param {number} ttl The time to live of the cache item
   */
  public constructor(public key: string, public ttl: number) {}
  
  /**
   * Checks if the cache item is expired
   * @returns {boolean} True if the cache item is expired, false otherwise
   */
  public isExpired(): boolean {
    return this.ttl !== cacheConstants.noExpirationTime && Date.now() >= this.ttl;
  }

  /**
   * Gets the value of the cache item
   * @returns {any} The value of the cache item
   * @abstract
   */
  public abstract get(): any;

  /**
   * Gets the value of the cache item asynchronously
   * @returns {Promise<any>} The value of the cache item
   * @async
   */
  public abstract getAsync(): Promise<any>;

  /**
   * Persists the cache item
   * @param {any} value The value of the cache item
   */
  public abstract set(value: any): void;

  /**
   * Persists the cache item asynchronously
   * @param {any} value The value of the cache item
   * @async
   */
  public abstract setAsync(value: any): Promise<void>;

  /**
   * Deletes the cache item
   */
  public abstract delete(): void;

  /**
   * Deletes the cache item asynchronously
   * @async
   */
  public abstract deleteAsync(): Promise<void>;

  /**
   * Do something when the cache item is expired
   */
  public abstract onExpired(): void;
}
