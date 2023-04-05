# express-chaos-middleware

Put some chaos in your express application.

## Description

The aim of this library is to provide simple chaos testing cases for express applications.

## Installation

```sh
npm add express-chaos-middleware
```

## Features

- Requests slowdown : Endpoints can be slowed down randomly 
- Random response error : Endpoints can respond randomly with an error code
- Random exception : Endpoints can throw exceptions randomly
- Seeding : Manage random to replay scenarios

Chaos features have a 10 percent "chance" of being called by default. The percentage can be changed in the configuration object.

## Seeding ?

A seed is a value (alphanumeric in this module) used to created a pseudorandom number generator.

The seed is used as the starting point for generating a sequence of random numbers that appear to be random, but are actually deterministic based on the seed value.

In our case, this is really useful to replay scenarios.

Example :
- The first API call trigger the slow function during 250ms
- The second call is normal (classic result)
- The third throw an exception

With a classic random function, it's impossible to replay this use case.

On the other hand, it's possible to replay this use case with a seeding system by using the same seed.

See https://en.wikipedia.org/wiki/Random_seed.

## Usage

### Simple usage

```js
const {chaos} = require('express-chaos-middleware');

app.use(chaos())
```

### Use an existing seed

The random seed can be configured in the input object param.

```js
const {chaos} = require('express-chaos-middleware');

app.use(chaos({
  // this seed throw an exception on the first call
  seed: 'uJaK8BUr2084pph',
}))
```

### Advanced usage - Change chaos probability

The probability of chaos can be configured in the input object param.

This parameter is a number value between 0 and 100.

```js
const {chaos} = require('express-chaos-middleware');

app.use(chaos({
  probability: 50,
}))
```

### Advanced usage - Override max delay

The max slowdown delay can be configured in the input object param.

```js
const {chaos} = require('express-chaos-middleware');

app.use(chaos({
  maxDelay: 1000,
}))
```

### Advanced usage - Use custom http error codes array

The http error codes array can be overridden in the input object param.

```js
const {chaos} = require('express-chaos-middleware');

app.use(chaos({
  errCodes: [400, 500],
}))
```

### Advanced usage - Use custom feature list 

The chaos feature list can be overridden in the input object param.

You can for example only use delay and http error codes with the following configuration

All rules are exported in the `Rules` object.

```js
const {chaos} = require('express-chaos-middleware');

app.use(chaos({
  rules: [Rules.DELAY, Rules.HTTPERROR],
}))
```

