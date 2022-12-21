const debug = require('debug')('express-chaos-middleware');

/**
 * @typedef {object} ChaosOptions
 * @property {number} [probability] Issue probability percent (0-100)
 * @property {number} [maxDelay] Max delay (ms)
 * @property {Array<number>} [errCodes] Error codes array
 * @property {Array<Rules>} [rules] Rules to apply
 */

/**
 * Wait X ms
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Requests slowdown
 */
async function delay(req, res, next) {
  const maxDelay = req.options?.maxDelay || 500;
  const pause = Math.floor(Math.random() * maxDelay);
  debug(`rulesFunctions.delay - wait ${pause} ms`);
  await wait(pause);
  next();
}

/**
 * Random response error
 */
function httpError(req, res) {
  const errCodes = req.options?.errCodes || [400, 401, 403, 404, 409, 500];
  const code = errCodes[Math.floor(Math.random() * errCodes.length)];
  debug(`rulesFunctions.httpError - send ${code} code`);
  res.statusCode = code;
  res.end();
}

/**
 * Throw random exception
 */
function exception() {
  debug(`rulesFunctions.exception - throw exception`);
  throw new Error('BOOM !');
}

const Rules = {
  DELAY: delay,
  HTTPERROR: httpError,
  EXCEPTION: exception,
};

/**
 * Randomly throw error and slow response
 * @param {ChaosOptions} options
 * @returns {Promise<void>}
 */
function chaos(options) {
  const probability = options?.probability || 10;
  if (!Number.isInteger(probability) || probability < 0 || probability > 100) {
    throw new Error('Invalid probability value');
  }

  const rules = options?.rules || [Rules.DELAY, Rules.HTTPERROR, Rules.EXCEPTION];
  return (req, res, next) => {
    req.options = options;
    const rand = Math.floor(Math.random() * 100);
    if (rand <= probability) {
      const rule = rules[Math.floor(Math.random() * rules.length)];
      return rule(req, res, next);
    }

    return next();
  };
}

module.exports = { chaos, Rules };
