# gaxabara-optional-ts

Typescript implementation of the Optional concept.

## Description

- Full Java 11 Optional API is supported, even stream() method and pure js iterator version.
- Runs in browser and node environments.
- Lightweight and dependency-free (<250 LOC)

## Installation

This module is installed via npm:

``` bash
$ npm install gaxabara-optional-ts
```

## Usage

``` js
var Optional = require('gaxabara-optional-ts');

// orElse usage
var opt    = Optional.ofNullable(null);
var result = opt.orElseGet(function() {
    return "hello";
});
console.log(result); // > hello

// flatMap usage
var opt2    = Optional.ofNullable("HELLO");
var result2 = opt2.flatMap(function(val) {
    return val + "-postfix";
});
console.log(result2); // > HELLO-postfix

// map usage
var opt3    = Optional.of("whatever");
var result3 = opt3.map(function(val) {
    return null;
}).orElse("not found");
console.log(result3); // > not found

// orElseThrow
var opt4    = Optional.ofNullable(null);
var result4 = opt4.orElseThrow(function() {
    return new Error("Naughty boy");
});
// > This throws an Error

// or returns an optional
var result = Optional.empty().or(function() {
    return "set";
});
console.log(result.get()); // set

// and it supports the fancy stream method as an iterable
for (const input of Optional.of("hello")) {
    console.log(input); // "hello"
}
```

## License

MIT © [](https://github.com/xaviferro/)
