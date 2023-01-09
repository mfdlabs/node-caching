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
	File Name: index.ts
	Description: The main export point for this package.
	Written by: Nikita Petko
*/

import BaseCacheItem from './caching/base/base_cache_item';
import BaseCacheRepository from './caching/base/base_cache_repository';

import NoopCacheRepository from './caching/noop/noop_cache_repository';
import MemoryCacheRepository from './caching/memory/memory_cache_repository';
import FileSystemCacheRepository from './caching/file_system/file_system_cache_repository';
import MemoryBackedByFileSystemCacheRepository from './caching/memory_backed_by_file_system_cache_repository';

export * as cachingConstants from './caching/cache_constants';

export {
  BaseCacheItem,
  BaseCacheRepository,
  NoopCacheRepository,
  MemoryCacheRepository,
  FileSystemCacheRepository,
  MemoryBackedByFileSystemCacheRepository,
};
