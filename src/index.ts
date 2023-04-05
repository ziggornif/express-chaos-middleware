import Debug from "debug";
import seedrandom from "seedrandom";

import type { Request, Response, NextFunction } from "express";
const debug = Debug("express-chaos-middleware");

const Rules = {
	DELAY: delay,
	HTTPERROR: httpError,
	EXCEPTION: exception,
};

type UserOptions = {
	seed?: string;
	probability?: number;
	maxDelay?: number;
	errCodes?: number[];
	rules?: Function[];
};

type ChaosOptions = UserOptions & {
	rng: Function;
};

/**
 * Generate alphanumeric seed
 * @param length - seed length
 * @returns seed
 */
function generateSeed(length: number): string {
	var result = "";
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

/**
 * Wait X ms
 * @param ms - waiting time
 */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Requests slowdown
 * @param req - express request
 * @param res - express response
 * @param next - express next function
 */
async function delay(req: Request, res: Response, next: NextFunction) {
	const maxDelay = req.options?.maxDelay || 500;
	const pause = Math.floor(req.options.rng() * maxDelay);
	debug(`rulesFunctions.delay - wait ${pause} ms`);
	await wait(pause);
	next();
}

/**
 * Random response error
 * @param req - express request
 * @param res - express response
 */
function httpError(req: Request, res: Response) {
	const errCodes = req.options?.errCodes || [400, 401, 403, 404, 409, 500];
	const code = errCodes[Math.floor(req.options.rng() * errCodes.length)];
	debug(`rulesFunctions.httpError - send ${code} code`);
	res.status(code);
	res.end();
}

/**
 * Throw random exception
 */
function exception() {
	debug(`rulesFunctions.exception - throw exception`);
	throw new Error("BOOM !");
}

/**
 * Randomly throw error and slow response
 * @param options - user options
 * @returns a chaos middleware instance
 */
function chaos(options?: UserOptions) {
	const seed = options?.seed || generateSeed(15);
	debug(`current seed ${seed}`);
	const rng = seedrandom(seed);
	const chaosOptions: ChaosOptions = {
		...options,
		seed,
		rng,
	};

	const probability = chaosOptions?.probability || 10;
	if (!Number.isInteger(probability) || probability < 0 || probability > 100) {
		throw new Error("Invalid probability value");
	}

	const rules = chaosOptions?.rules || [
		Rules.DELAY,
		Rules.HTTPERROR,
		Rules.EXCEPTION,
	];

	return (req: Request, res: Response, next: NextFunction) => {
		req.options = chaosOptions;
		const rand = Math.floor(chaosOptions.rng() * 100);
		if (rand <= probability) {
			const rule = rules[Math.floor(chaosOptions.rng() * rules.length)];
			return rule(req, res, next);
		}
		return next();
	};
}

export { chaos, Rules };
