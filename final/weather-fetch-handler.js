/*
 Copyright 2015 Google Inc. All rights reserved.
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

(function(global) {
  function stripSearchParameters(url) {
    var strippedUrl = new URL(url);
    strippedUrl.search = '';
    return strippedUrl.toString();
  }

  global.weatherFetchHandler = function(request) {
    return global.fetch(request).then(function(response) {
      if (response.ok) {
        return global.caches.open(global.toolbox.options.cacheName).then(function(cache) {
          return cache.put(stripSearchParameters(request.url), response.clone()).then(function() {
            return response;
          });
        });
      }

      throw new Error('A response with an error status code was returned.');
    }).catch(function(error) {
      return global.caches.open(global.toolbox.options.cacheName).then(function(cache) {
        return cache.match(stripSearchParameters(request.url));
      });
    });
  }
})(self);
