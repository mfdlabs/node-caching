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
	File Name: memory_cache_item.ts
	Written by: Nikita Petko
*/

import BaseCacheItem from '../base/base_cache_item';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * A class that represents a cache item that is stored in memory.
 * @internal This class is only ingested internally.
 */
export default class MemoryCacheItem extends BaseCacheItem {
  private _value: any;

  /**
   * Creates an instance of MemoryCacheItem.
   * @param {string} key The key of the cache item.
   * @param {number} ttl The time to live of the cache item.
   */
  constructor(key: string, ttl: number) {
    super(key, ttl);
  }

  /**
   * Gets the value of the cache item
   * @returns {any} The value of the cache item
   */
  public get(): any {
    return this._value;
  }

  /**
   * Gets the value of the cache item asynchronously
   * @returns {Promise<any>} The value of the cache item
   * @async
   */
  public getAsync(): Promise<any> {
    return Promise.resolve(this._value);
  }

  /**
   * Persists the cache item
   * @param {any} _value The value of the cache item
   */
  public set(_value: any): void {
    this._value = _value;
  }

  /**
   * Persists the cache item asynchronously
   * @param {any} _value The value of the cache item
   * @returns {Promise<void>}
   * @async
   */
  public setAsync(_value: any): Promise<void> {
    this._value = _value;

    return Promise.resolve();
  }

  /**
   * Deletes the cache item
   */
  public delete(): void {
    delete this._value;
  }

  /**
   * Deletes the cache item asynchronously
   * @returns {Promise<void>}
   * @async
   */
  public deleteAsync(): Promise<void> {
    delete this._value;

    return Promise.resolve();
  }

  /**
   * Do something when the cache item is expired
   */
  public onExpired(): void {
    delete this._value;
    return;
  }
}
