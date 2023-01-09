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
	File Name: memory_backed_by_file_system_cache_item.ts
	Written by: Nikita Petko
*/

import BaseCacheItem from './base/base_cache_item';
import MemoryCacheItem from './memory/memory_cache_item';
import FileSystemCacheItem from './file_system/file_system_cache_item';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * A class that represents a cache item that is backed by file system.
 * @internal This class is only ingested internally.
 */
export default class MemoryBackedByFileSystemCacheItem extends BaseCacheItem {
  private readonly _memoryCacheItem: MemoryCacheItem;
  private readonly _fileSystemCacheItem: FileSystemCacheItem;

  /**
   * Creates an instance of MemoryBackedByFileSystemCacheItem.
   * @param {string} key The key of the cache item.
   * @param {number} ttl The time to live of the cache item.
   */
  constructor(key: string, ttl: number) {
    super(key, ttl);

    this._memoryCacheItem = new MemoryCacheItem(key, ttl);
    this._fileSystemCacheItem = new FileSystemCacheItem(key, ttl + 2000);
  }

  /**
   * Gets the value of the cache item
   * @returns {any} The value of the cache item
   */
  public get(): any {
    const memoryCacheItemValue = this._memoryCacheItem.get();
    if (memoryCacheItemValue !== undefined) {
      return memoryCacheItemValue;
    }

    return this._fileSystemCacheItem.get();
  }

  /**
   * Gets the value of the cache item asynchronously
   * @returns {Promise<any>} The value of the cache item
   * @async
   */
  public async getAsync(): Promise<any> {
    const memoryCacheItemValue = await this._memoryCacheItem.getAsync();
    if (memoryCacheItemValue !== undefined) {
      return memoryCacheItemValue;
    }

    return await this._fileSystemCacheItem.getAsync();
  }

  /**
   * Persists the cache item
   * @param {any} _value The value of the cache item
   */
  public set(_value: any): void {
    this._memoryCacheItem.set(_value);
    this._fileSystemCacheItem.set(_value);
  }

  /**
   * Persists the cache item asynchronously
   * @param {any} _value The value of the cache item
   * @returns {Promise<void>}
   * @async
   */
  public async setAsync(_value: any): Promise<void> {
    await this._memoryCacheItem.setAsync(_value);
    await this._fileSystemCacheItem.setAsync(_value);
  }

  /**
   * Deletes the cache item
   */
  public delete(): void {
    this._memoryCacheItem.delete();
    this._fileSystemCacheItem.delete();
  }

  /**
   * Deletes the cache item asynchronously
   * @returns {Promise<void>}
   * @async
   */
  public async deleteAsync(): Promise<void> {
    await this._memoryCacheItem.deleteAsync();
    await this._fileSystemCacheItem.deleteAsync();
  }

  /**
   * Do something when the cache item is expired
   */
  public onExpired(): void {
    this.delete();
  }
}
