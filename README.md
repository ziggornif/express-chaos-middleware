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

Chaos features have a 10 percent "chance" of being called by default. The percentage can be changed in the configuration object.

## Usage

### Simple usage

```js
const {chaos} = require('express-chaos-middleware');

app.use(chaos())
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

The max slowdown delay can be configured in the input object param.

```js
const {chaos} = require('express-chaos-middleware');

app.use(chaos({
  errCodes: [400, 500],
}))
```

### Advanced usage - Use custom feature list 

The chaos feature list can be overrided in the input object param.

You can for example only use delay and http error codes with the following configuration

All rules are exported in the `Rules` object.

```js
const {chaos} = require('express-chaos-middleware');

app.use(chaos({
  rules: [Rules.DELAY, Rules.HTTPERROR],
}))
```

