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
	File Name: cache_constants.ts
	Written by: Nikita Petko
*/

/**
 * Default sliding expiration time in milliseconds
 * @type {number} The default sliding expiration time in milliseconds
 * @note This is the expiration used when an absolute expiration time is not specified, it is relative to Date.now()
 */
export const defaultSlidingExpirationTime: number = 60000 as const;

/**
 * No expiration time
 * @type {number} No expiration time
 */
export const noExpirationTime: number = -1 as const;
