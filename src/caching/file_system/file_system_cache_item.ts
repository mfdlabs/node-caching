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
	File Name: file_system_cache_item.ts
	Written by: Nikita Petko
*/

import BaseCacheItem from '../base/base_cache_item';

import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const unlinkAsync = util.promisify(fs.unlink);

/**
 * A class that represents a cache item that is stored on the file system.
 * @internal This class is only ingested internally.
 */
export default class FileSystemCacheItem extends BaseCacheItem {
  private _cacheItemFilePath: string;

  /**
   * Creates an instance of FileSystemCacheItem.
   * @param {string} key The key of the cache item.
   * @param {number} ttl The time to live of the cache item.
   */
  constructor(key: string, ttl: number) {
    super(key, ttl);
  }

  private _getCacheItemFilePath(): string {
    if (this._cacheItemFilePath) {
      return this._cacheItemFilePath;
    }

    // Generate a random file name
    const randomFileName = `${
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }.mfdlabs-cache-item`;

    // Generate the cache item file path
    this._cacheItemFilePath =
      process.platform === 'win32'
        ? path.join(process.env.TEMP, randomFileName)
        : path.join('/var/tmp', randomFileName);

    return this._cacheItemFilePath;
  }

  private _tryReadCacheItem(): any {
    try {
      return fs.readFileSync(this._getCacheItemFilePath(), 'utf8');
    } catch (err) {
      return undefined;
    }
  }

  private async _tryReadCacheItemAsync(): Promise<any> {
    try {
      return await readFileAsync(this._getCacheItemFilePath(), 'utf8');
    } catch (err) {
      return undefined;
    }
  }

  private _tryDeleteCacheItem(): void {
    try {
      fs.unlinkSync(this._getCacheItemFilePath());
    } catch (err) {
      return;
    }
  }

  private async _tryDeleteCacheItemAsync(): Promise<void> {
    try {
      await unlinkAsync(this._getCacheItemFilePath());
    } catch (err) {
      return;
    }
  }

  /**
   * Gets the value of the cache item
   * @returns {any} The value of the cache item
   */
  public get(): any {
    return this._tryReadCacheItem();
  }

  /**
   * Gets the value of the cache item asynchronously
   * @returns {Promise<any>} The value of the cache item
   * @async
   */
  public async getAsync(): Promise<any> {
    return await this._tryReadCacheItemAsync();
  }

  /**
   * Persists the cache item
   * @param {any} value The value of the cache item
   */
  public set(value: any): void {
    fs.writeFileSync(this._getCacheItemFilePath(), value);
  }

  /**
   * Persists the cache item asynchronously
   * @param {any} value The value of the cache item
   * @returns {Promise<void>}
   * @async
   */
  public async setAsync(value: any): Promise<void> {
    await writeFileAsync(this._getCacheItemFilePath(), value);
  }

  /**
   * Deletes the cache item
   */
  public delete(): void {
    this._tryDeleteCacheItem();
  }

  /**
   * Deletes the cache item asynchronously
   * @returns {Promise<void>}
   * @async
   */
  public async deleteAsync(): Promise<void> {
    await this._tryDeleteCacheItemAsync();
  }

  /**
   * Do something when the cache item is expired
   */
  public onExpired(): void {
    this.delete();
  }
}
