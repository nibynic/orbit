'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encodeQueryParams = encodeQueryParams;
exports.appendQueryParams = appendQueryParams;
function flattenObjectToParams(obj, path = []) {
    let params = [];
    Object.keys(obj).forEach(key => {
        if (!obj.hasOwnProperty(key)) {
            return;
        }
        let newPath = path.slice();
        newPath.push(key);
        if (obj[key] !== null && typeof obj[key] === 'object') {
            Array.prototype.push.apply(params, flattenObjectToParams(obj[key], newPath));
        } else {
            params.push({
                path: newPath,
                val: obj[key]
            });
        }
    });
    return params;
}
function encodeQueryParams(obj) {
    return flattenObjectToParams(obj).map(param => {
        if (param.path.length === 1) {
            param.path = param.path[0];
        } else {
            let firstSegment = param.path[0];
            let remainingSegments = param.path.slice(1);
            param.path = firstSegment + '[' + remainingSegments.join('][') + ']';
        }
        return param;
    }).map(param => encodeURIComponent(param.path) + '=' + encodeURIComponent(param.val)).join('&');
}
function appendQueryParams(url, obj) {
    let fullUrl = url;
    if (obj.filter && Array.isArray(obj.filter)) {
        let filter = obj.filter;
        delete obj.filter;
        filter.forEach(filterOption => {
            fullUrl = appendQueryParams(fullUrl, { filter: filterOption });
        });
    }
    let queryParams = encodeQueryParams(obj);
    if (queryParams.length > 0) {
        fullUrl += nextQueryParamIndicator(fullUrl);
        fullUrl += queryParams;
    }
    return fullUrl;
}
function nextQueryParamIndicator(url) {
    if (url.indexOf('?') === -1) {
        return '?';
    }
    return '&';
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9xdWVyeS1wYXJhbXMuanMiXSwibmFtZXMiOlsiZW5jb2RlUXVlcnlQYXJhbXMiLCJhcHBlbmRRdWVyeVBhcmFtcyIsImZsYXR0ZW5PYmplY3RUb1BhcmFtcyIsIm9iaiIsInBhdGgiLCJwYXJhbXMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImhhc093blByb3BlcnR5IiwibmV3UGF0aCIsInNsaWNlIiwicHVzaCIsIkFycmF5IiwicHJvdG90eXBlIiwiYXBwbHkiLCJ2YWwiLCJtYXAiLCJwYXJhbSIsImxlbmd0aCIsImZpcnN0U2VnbWVudCIsInJlbWFpbmluZ1NlZ21lbnRzIiwiam9pbiIsImVuY29kZVVSSUNvbXBvbmVudCIsInVybCIsImZ1bGxVcmwiLCJmaWx0ZXIiLCJpc0FycmF5IiwiZmlsdGVyT3B0aW9uIiwicXVlcnlQYXJhbXMiLCJuZXh0UXVlcnlQYXJhbUluZGljYXRvciIsImluZGV4T2YiXSwibWFwcGluZ3MiOiI7Ozs7O1FBbUJnQkEsaUIsR0FBQUEsaUI7UUFZQUMsaUIsR0FBQUEsaUI7QUEvQmhCLFNBQVNDLHFCQUFULENBQStCQyxHQUEvQixFQUFvQ0MsT0FBTyxFQUEzQyxFQUErQztBQUMzQyxRQUFJQyxTQUFTLEVBQWI7QUFDQUMsV0FBT0MsSUFBUCxDQUFZSixHQUFaLEVBQWlCSyxPQUFqQixDQUF5QkMsT0FBTztBQUM1QixZQUFJLENBQUNOLElBQUlPLGNBQUosQ0FBbUJELEdBQW5CLENBQUwsRUFBOEI7QUFDMUI7QUFDSDtBQUNELFlBQUlFLFVBQVVQLEtBQUtRLEtBQUwsRUFBZDtBQUNBRCxnQkFBUUUsSUFBUixDQUFhSixHQUFiO0FBQ0EsWUFBSU4sSUFBSU0sR0FBSixNQUFhLElBQWIsSUFBcUIsT0FBT04sSUFBSU0sR0FBSixDQUFQLEtBQW9CLFFBQTdDLEVBQXVEO0FBQ25ESyxrQkFBTUMsU0FBTixDQUFnQkYsSUFBaEIsQ0FBcUJHLEtBQXJCLENBQTJCWCxNQUEzQixFQUFtQ0gsc0JBQXNCQyxJQUFJTSxHQUFKLENBQXRCLEVBQWdDRSxPQUFoQyxDQUFuQztBQUNILFNBRkQsTUFFTztBQUNITixtQkFBT1EsSUFBUCxDQUFZO0FBQ1JULHNCQUFNTyxPQURFO0FBRVJNLHFCQUFLZCxJQUFJTSxHQUFKO0FBRkcsYUFBWjtBQUlIO0FBQ0osS0FkRDtBQWVBLFdBQU9KLE1BQVA7QUFDSDtBQUNNLFNBQVNMLGlCQUFULENBQTJCRyxHQUEzQixFQUFnQztBQUNuQyxXQUFPRCxzQkFBc0JDLEdBQXRCLEVBQTJCZSxHQUEzQixDQUErQkMsU0FBUztBQUMzQyxZQUFJQSxNQUFNZixJQUFOLENBQVdnQixNQUFYLEtBQXNCLENBQTFCLEVBQTZCO0FBQ3pCRCxrQkFBTWYsSUFBTixHQUFhZSxNQUFNZixJQUFOLENBQVcsQ0FBWCxDQUFiO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsZ0JBQUlpQixlQUFlRixNQUFNZixJQUFOLENBQVcsQ0FBWCxDQUFuQjtBQUNBLGdCQUFJa0Isb0JBQW9CSCxNQUFNZixJQUFOLENBQVdRLEtBQVgsQ0FBaUIsQ0FBakIsQ0FBeEI7QUFDQU8sa0JBQU1mLElBQU4sR0FBYWlCLGVBQWUsR0FBZixHQUFxQkMsa0JBQWtCQyxJQUFsQixDQUF1QixJQUF2QixDQUFyQixHQUFvRCxHQUFqRTtBQUNIO0FBQ0QsZUFBT0osS0FBUDtBQUNILEtBVE0sRUFTSkQsR0FUSSxDQVNBQyxTQUFTSyxtQkFBbUJMLE1BQU1mLElBQXpCLElBQWlDLEdBQWpDLEdBQXVDb0IsbUJBQW1CTCxNQUFNRixHQUF6QixDQVRoRCxFQVMrRU0sSUFUL0UsQ0FTb0YsR0FUcEYsQ0FBUDtBQVVIO0FBQ00sU0FBU3RCLGlCQUFULENBQTJCd0IsR0FBM0IsRUFBZ0N0QixHQUFoQyxFQUFxQztBQUN4QyxRQUFJdUIsVUFBVUQsR0FBZDtBQUNBLFFBQUl0QixJQUFJd0IsTUFBSixJQUFjYixNQUFNYyxPQUFOLENBQWN6QixJQUFJd0IsTUFBbEIsQ0FBbEIsRUFBNkM7QUFDekMsWUFBSUEsU0FBU3hCLElBQUl3QixNQUFqQjtBQUNBLGVBQU94QixJQUFJd0IsTUFBWDtBQUNBQSxlQUFPbkIsT0FBUCxDQUFlcUIsZ0JBQWdCO0FBQzNCSCxzQkFBVXpCLGtCQUFrQnlCLE9BQWxCLEVBQTJCLEVBQUVDLFFBQVFFLFlBQVYsRUFBM0IsQ0FBVjtBQUNILFNBRkQ7QUFHSDtBQUNELFFBQUlDLGNBQWM5QixrQkFBa0JHLEdBQWxCLENBQWxCO0FBQ0EsUUFBSTJCLFlBQVlWLE1BQVosR0FBcUIsQ0FBekIsRUFBNEI7QUFDeEJNLG1CQUFXSyx3QkFBd0JMLE9BQXhCLENBQVg7QUFDQUEsbUJBQVdJLFdBQVg7QUFDSDtBQUNELFdBQU9KLE9BQVA7QUFDSDtBQUNELFNBQVNLLHVCQUFULENBQWlDTixHQUFqQyxFQUFzQztBQUNsQyxRQUFJQSxJQUFJTyxPQUFKLENBQVksR0FBWixNQUFxQixDQUFDLENBQTFCLEVBQTZCO0FBQ3pCLGVBQU8sR0FBUDtBQUNIO0FBQ0QsV0FBTyxHQUFQO0FBQ0giLCJmaWxlIjoibGliL3F1ZXJ5LXBhcmFtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGZsYXR0ZW5PYmplY3RUb1BhcmFtcyhvYmosIHBhdGggPSBbXSkge1xuICAgIGxldCBwYXJhbXMgPSBbXTtcbiAgICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuZXdQYXRoID0gcGF0aC5zbGljZSgpO1xuICAgICAgICBuZXdQYXRoLnB1c2goa2V5KTtcbiAgICAgICAgaWYgKG9ialtrZXldICE9PSBudWxsICYmIHR5cGVvZiBvYmpba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHBhcmFtcywgZmxhdHRlbk9iamVjdFRvUGFyYW1zKG9ialtrZXldLCBuZXdQYXRoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJhbXMucHVzaCh7XG4gICAgICAgICAgICAgICAgcGF0aDogbmV3UGF0aCxcbiAgICAgICAgICAgICAgICB2YWw6IG9ialtrZXldXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwYXJhbXM7XG59XG5leHBvcnQgZnVuY3Rpb24gZW5jb2RlUXVlcnlQYXJhbXMob2JqKSB7XG4gICAgcmV0dXJuIGZsYXR0ZW5PYmplY3RUb1BhcmFtcyhvYmopLm1hcChwYXJhbSA9PiB7XG4gICAgICAgIGlmIChwYXJhbS5wYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcGFyYW0ucGF0aCA9IHBhcmFtLnBhdGhbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZmlyc3RTZWdtZW50ID0gcGFyYW0ucGF0aFswXTtcbiAgICAgICAgICAgIGxldCByZW1haW5pbmdTZWdtZW50cyA9IHBhcmFtLnBhdGguc2xpY2UoMSk7XG4gICAgICAgICAgICBwYXJhbS5wYXRoID0gZmlyc3RTZWdtZW50ICsgJ1snICsgcmVtYWluaW5nU2VnbWVudHMuam9pbignXVsnKSArICddJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgfSkubWFwKHBhcmFtID0+IGVuY29kZVVSSUNvbXBvbmVudChwYXJhbS5wYXRoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbS52YWwpKS5qb2luKCcmJyk7XG59XG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kUXVlcnlQYXJhbXModXJsLCBvYmopIHtcbiAgICBsZXQgZnVsbFVybCA9IHVybDtcbiAgICBpZiAob2JqLmZpbHRlciAmJiBBcnJheS5pc0FycmF5KG9iai5maWx0ZXIpKSB7XG4gICAgICAgIGxldCBmaWx0ZXIgPSBvYmouZmlsdGVyO1xuICAgICAgICBkZWxldGUgb2JqLmZpbHRlcjtcbiAgICAgICAgZmlsdGVyLmZvckVhY2goZmlsdGVyT3B0aW9uID0+IHtcbiAgICAgICAgICAgIGZ1bGxVcmwgPSBhcHBlbmRRdWVyeVBhcmFtcyhmdWxsVXJsLCB7IGZpbHRlcjogZmlsdGVyT3B0aW9uIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbGV0IHF1ZXJ5UGFyYW1zID0gZW5jb2RlUXVlcnlQYXJhbXMob2JqKTtcbiAgICBpZiAocXVlcnlQYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgICBmdWxsVXJsICs9IG5leHRRdWVyeVBhcmFtSW5kaWNhdG9yKGZ1bGxVcmwpO1xuICAgICAgICBmdWxsVXJsICs9IHF1ZXJ5UGFyYW1zO1xuICAgIH1cbiAgICByZXR1cm4gZnVsbFVybDtcbn1cbmZ1bmN0aW9uIG5leHRRdWVyeVBhcmFtSW5kaWNhdG9yKHVybCkge1xuICAgIGlmICh1cmwuaW5kZXhPZignPycpID09PSAtMSkge1xuICAgICAgICByZXR1cm4gJz8nO1xuICAgIH1cbiAgICByZXR1cm4gJyYnO1xufSJdfQ==