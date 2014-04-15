/*jshint eqnull:true, expr:true*/

var _ = { };

(function() {

    // Returns whatever value is passed as the argument. This function doesn't
    // seem very useful, but remember it--if a function needs to provide an
    // iterator when the user does not pass one in, this will be handy.
    _.identity = function(val) {
      return val;
    };

    /**
     * COLLECTIONS
     * ===========
     *
     * In this section, we'll have a look at functions that operate on collections
     * of values; in JavaScript, a 'collection' is something that can contain a
     * number of values--either an array or an object.
     */

    // Return an array of the first n elements of an array. If n is undefined,
    // return just the first element.
    _.first = function(array, n) {
        return n === undefined ? array[0] : array.slice(0, n);
    };

    // Like first, but for the last elements. If n is undefined, return just the
    // last element.
    _.last = function(array, n) {
      return n === undefined ? array[array.length - 1]
                             : array.slice(Math.max(array.length - n, 0));
    };

    // Call iterator(value, key, collection) for each element of collection.
    // Accepts both arrays and objects.
    //
    // Note: _.each does not have a return value, but rather simply runs the
    // iterator function over each item in the input collection.
    _.each = function(collection, iterator) {
      if (Array.isArray(collection)) {
        for (var i = 0; i < collection.length; i++) {
          iterator(collection[i], i, collection);
        }
      } else {
        for (var i in collection) {
          iterator(collection[i], i, collection);
        }
      }
    };

    // Returns the index at which value can be found in the array, or -1 if value
    // is not present in the array.
    _.indexOf = function(array, target){
        // TIP: Here's an example of a function that needs to iterate, which we've
        // implemented for you. Instead of using a standard `for` loop, though,
        // it uses the iteration helper `each`, which you will need to write.
        var result = -1;

        _.each(array, function(item, index) {
            if (item === target && result === -1) {
                result = index;
            }
        });

        return result;
    };

    // Return all elements of an array that pass a truth test.
    _.filter = function(collection, test) {
      return _.reduce(collection, function(accumulator, value) {
        if (test(value)) {
          accumulator.push(value);
        }
        return accumulator;
      }, []);
    };

    var not = function (func) {
      return function () {
        return !func.apply(null, arguments);
      };
    };

    // Return all elements of an array that don't pass a truth test.
    _.reject = function(collection, test) {
      // TIP: see if you can re-use _.filter() here, without simply
      // copying code in and modifying it
      return _.filter(collection, not(test));
    };

    // Produce a duplicate-free version of the array.
    _.uniq = function(array) {
      var uniqObj = {};

      return _.filter(array, function (val) {
        var present = uniqObj[val];
        uniqObj[val] = true ;
        return !present;
      });
    };


    // Return the results of applying an iterator to each element.
    _.map = function(array, iterator) {
        // map() is a useful primitive iteration function that works a lot
        // like each(), but in addition to running the operation on all
        // the members, it also maintains an array of results.
      return _.reduce(array, function(accumulator, value) {
        accumulator.push(iterator(value));
        return accumulator;
      }, []);
        //
    };

    /*
     * TIP: map is really handy when you want to transform an array of
     * values into a new array of values. _.pluck() is solved for you
     * as an example of this.
     */

    // Takes an array of objects and returns and array of the values of
    // a certain property in it. E.g. take an array of people and return
    // an array of just their ages
    _.pluck = function(array, propertyName) {
        // TIP: map is really handy when you want to transform an array of
        // values into a new array of values. _.pluck() is solved for you
        // as an example of this.
        return _.map(array, function(value){
            return value[propertyName];
        });
    };

    var makeInvoker = function (functionOrKey, args) {
      if (typeof functionOrKey === "string") {
        var invoker = function () { return this[functionOrKey](); };
      } else if (typeof functionOrKey === "function") {
        var invoker = functionOrKey;
      } else {
        throw new Error("Wrong type for functionOrKey.");
      }

      return function (val) { return invoker.apply(val, args); };
    };

    // Calls the method named by methodName on each value in the list.
    // Note: you will nead to learn a bit about .apply to complete this.
    _.invoke = function(collection, functionOrKey, args) {
      return _.map(collection, makeInvoker(functionOrKey, args));
    };

    // Reduces an array or object to a single value by repetitively calling
    // iterator(previousValue, item) for each item. previousValue should be
    // the return value of the previous iterator call.
    //
    // You can pass in an initialValue that is passed to the first iterator
    // call. If initialValue is not explicitly passed in, it should default to the
    // first element in the collection.
    //
    // Example:
    //   var numbers = [1,2,3];
    //   var sum = _.reduce(numbers, function(total, number){
    //     return total + number;
    //   }, 0); // should be 6
    _.reduce = function(collection, iterator, accumulator) {
      _.each(collection, function(element) {
        accumulator = iterator(accumulator, element);
      });
      return accumulator;
    };

    // Determine if the array or object contains a given value (using `===`).
    _.contains = function(collection, target) {
        // TIP: Many iteration problems can be most easily expressed in
        // terms of reduce(). Here's a freebie to demonstrate!
      return _.reduce(collection, function(wasFound, item) {
        if (wasFound) {
          return true;
        }
        return item === target;
      }, false);
    };

    // Determine whether all of the elements match a truth test.
    _.every = function(collection, iterator) {
      iterator = iterator || _.identity;
      return _.reduce(collection, function(accumulator, element) {
        return !!(accumulator && iterator(element));
      }, true);
    };

    // Determine whether any of the elements pass a truth test. If no iterator is
    // provided, provide a default one
    _.some = function(collection, iterator) {
      // TIP: There's a very clever way to re-use every() here.
      iterator = iterator || _.identity;
      return !_.every(collection, not(iterator));
    };


    /**
     * OBJECTS
     * =======
     *
     * In this section, we'll look at a couple of helpers for merging objects.
     */

    // Extend a given object with all the properties of the passed in
    // object(s).
    //
    // Example:
    //   var obj1 = {key1: "something"};
    //   _.extend(obj1, {
    //     key2: "something new",
    //     key3: "something else new"
    //   }, {
    //     bla: "even more stuff"
    //   }); // obj1 now contains key1, key2, key3 and bla
    var extendObj = function(obj, def, others) {
      _.each(others, function (other) {
        _.each(other, function (value, key) {
          if (def) {
            if (!(key in obj)) {
              obj[key] = value;
            }
          } else {
            obj[key] = value;
          }
        });
      });
      return obj;
    };

    var toArray = function (array) {
      return Array.prototype.slice.call(array);
    };

    _.extend = function(obj) {
      return extendObj(obj, false, toArray(arguments).slice(1));
    };

    // Like extend, but doesn't ever overwrite a key that already
    // exists in obj
    _.defaults = function(obj) {
      return extendObj(obj, true, toArray(arguments).slice(1));
    };


    /**
     * FUNCTIONS
     * =========
     *
     * Now we're getting into function decorators, which take in any function
     * and return out a new version of the function that works somewhat differently
     */

    // Return a function that can be called at most one time. Subsequent calls
    // should return the previously returned value.
    _.once = function(func) {
        // TIP: These variables are stored in a "closure scope" (worth researching),
        // so that they'll remain available to the newly-generated function every
        // time it's called.
        var alreadyCalled = false;
        var result;

        // TIP: We'll return a new function that delegates to the old one, but only
        // if it hasn't been called before.
        return function() {
            if (!alreadyCalled) {
                // TIP: .apply(this, arguments) is the standard way to pass on all of the
                // infromation from one function call to another.
                result = func.apply(this, arguments);
                alreadyCalled = true;
            }
            // The new function always returns the originally computed result.
            return result;
        };
    };

    // Memoize an expensive function by storing its results. You may assume
    // that the function takes only one argument and that it is a primitive.
    //
    // _.memoize should return a function that when called, will check if it has
    // already computed the result for the given argument and return that value
    // instead if possible.
    _.memoize = function(func) {
      var cache = {};
      return function (arg) {
        if (!(arg in cache)) {
          cache[arg] = func(arg);
        }
        return cache[arg];
      };
    };

    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    //
    // The arguments for the original function are passed after the wait
    // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
    // call someFunction('a', 'b') after 500ms
    _.delay = function(func, wait) {
      var extraArgs = toArray(arguments).slice(2);

      setTimeout(function () {
        return func.apply(this, extraArgs);
      }, wait);
    };

    /**
     * ADVANCED COLLECTION OPERATIONS
     * ==============================
     */

    var randomInt = function (min, max) {
      return Math.random() * (max - min) + min;
    };

    // Randomizes the order of an array's contents.
    //
    // TIP: This function's test suite will ask that you not modify the original
    // input array. For a tip on how to make a copy of an array, see:
    // http://mdn.io/Array.prototype.slice
    _.shuffle = function(array) {
      var randomArray = Array.prototype.slice(array);
      _.each(randomArray, function(_val, index) {
        var otherIndex = randomInt(index + 1, randomArray.length - 1);
        var tmp = randomArray[index];
        randomArray[index] = randomArray[otherIndex];
        randomArray[otherIndex] = tmp;
      });
      return randomArray;
    };


    /**
     * Note: This is the end of the pre-course curriculum. Feel free to continue,
     * but nothing beyond here is required.
     */


    // Sort the object's values by a criterion produced by an iterator.
    // If iterator is a string, sort objects by that property with the name
    // of that string. For example, _.sortBy(people, 'name') should sort
    // an array of people by their name.
    /*
    var sort = function (array) {
      //placeholder
      return array.slice().sort();
    };
    */

    _.sortBy = function(collection, iterator) {
      iterator = iterator || _.identity;
      if (typeof iterator === 'string') {
        var invoker = function (val) {
          return val[iterator];
        };
      } else {
        var invoker = iterator;
      }
      var sortFunc = function (a, b) {
        return invoker(a) > invoker(b);
      };
      return collection.slice().sort(sortFunc);
    };

    var times = function (n, func) {
      for (var i = 0; i < n; i++) {
        func();
      }
    };

    // Zip together two or more arrays with elements of the same index
    // going together.
    //
    // Example:
    // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
    _.zip = function() {
      var arrays = toArray(arguments);
      var finalLength = Math.max.apply(null, _.pluck(arrays, 'length'));

      var results = [];
      times(finalLength, function () {
        results.push([]);
      });
      _.each(arrays, function (array) {
        for (var i = 0; i < finalLength; i++) {
          results[i].push(array[i]);
        }
      });

      return results;
    };

    // Takes a multidimensional array and converts it to a one-dimensional array.
    // The new array should contain all elements of the multidimensional array.
    //
    // Hint: Use Array.isArray to check if something is an array
    _.flatten = function(nestedArray, result) {
      return _.reduce(nestedArray, function (result, possibArray) {
        if (Array.isArray(possibArray)) {
          return result.concat(_.flatten(possibArray));
        } else {
          result.push(possibArray);
          return result;
        }
      }, []);
    };

    // Takes an arbitrary number of arrays and produces an array that contains
    // every item shared between all the passed-in arrays.
    _.intersection = function() {
    };

    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function(array) {
    };


    /**
     * MEGA EXTRA CREDIT
     * =================
     */

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time.
    //
    // See the Underbar readme for details.
    _.throttle = function(func, wait, leading) {
      var lastTime = 0;
      var lastVal;
      var waitCall = false;
      leading = leading === undefined ? false : true;

      if (leading) {
        setInterval(function () {
          if (waitCall) {
            lastVal = func.apply(this);
            waitCall = false;
            lastTime = Date.now();
          }
        }, wait);
      }
      return function () {
        if (Date.now() - lastTime >= wait) {
          lastTime = Date.now();
          lastVal = func.apply(this, arguments);
        } else {
          waitCall = true;
        }
        return lastVal;
      };
    };

}).call(this);
