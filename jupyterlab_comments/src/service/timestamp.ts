/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export function timeAgo(current, previous) {
  //Returns a new timestamp string (i.e. "20 minutes ago", "3 days ago")
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;

    var elapsed = current - previous;
    let time : number;

    if (elapsed < msPerMinute) {
      time = Math.round(elapsed/1000);
      if (time === 1) {
        return time + ' second ago';
      } else {
        return time + ' seconds ago'
      }
    }

    else if (elapsed < msPerHour) {
      time = Math.round(elapsed/msPerMinute);
      if (time === 1) {
        return time + ' minute ago';
      } else {
        return time + ' minutes ago'
      }
    }

    else if (elapsed < msPerDay ) {
      time = Math.round(elapsed/msPerHour);
      if (time === 1) {
        return time + ' hour ago';
      } else {
        return time + ' hours ago'
      }
    }

    else if (elapsed < msPerMonth) {
      time = Math.round(elapsed/msPerDay);
      if (time === 1) {
        return time + ' day ago';
      } else {
        return time + ' days ago'
      }
    }

    else {
      return '> 1 month ago';
    }
}
