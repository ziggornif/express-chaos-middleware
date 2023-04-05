import { describe, expect, beforeEach, it, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import * as lib from "./index";

describe("Express chaos middleware", () => {
	beforeEach(() => vi.clearAllMocks);
	it("should slow application", () =>
		new Promise<void>((done) => {
			const delaySpy = vi.spyOn(lib.Rules, "DELAY");
			const req = vi.fn() as unknown as Request;
			const res = vi.fn() as unknown as Response;
			const next = () => {
				expect(delaySpy).toHaveBeenCalled();
				done();
			};

			lib.chaos({ seed: "nKHGgrOtnZzTrXk" })(req, res, next);
		}));

	it("should return http error", () =>
		new Promise<void>((done) => {
			const httpErrSpy = vi.spyOn(lib.Rules, "HTTPERROR");
			const req = vi.fn() as unknown as Request;
			const res = {
				statusCode: 200,
				status: (code) => {
					//@ts-ignore
					this.statusCode = code;
				},
				end: () => {
					expect(httpErrSpy).toHaveBeenCalled();
					done();
				},
			} as Response;
			const next = () => true;

			lib.chaos({
				seed: "ApOlNU3K89qZ8AJ",
			})(req, res, next);
		}));

	it("should throw error", () => {
		const exceptionSpy = vi.spyOn(lib.Rules, "EXCEPTION");
		const req = vi.fn() as unknown as Request;
		const res = vi.fn() as unknown as Response;
		const next = vi.fn() as unknown as NextFunction;

		expect(() =>
			lib.chaos({
				seed: "uJaK8BUr2084pph",
			})(req, res, next),
		).toThrow(Error);
		expect(exceptionSpy).toHaveBeenCalled();
	});

	it("should skip chaos function", () =>
		new Promise<void>((done) => {
			const exceptionSpy = vi.spyOn(lib.Rules, "EXCEPTION");
			const httpErrSpy = vi.spyOn(lib.Rules, "HTTPERROR");
			const delaySpy = vi.spyOn(lib.Rules, "DELAY");
			const req = vi.fn() as unknown as Request;
			const res = vi.fn() as unknown as Response;
			const next = () => {
				expect(exceptionSpy).not.toHaveBeenCalled();
				expect(httpErrSpy).not.toHaveBeenCalled();
				expect(delaySpy).not.toHaveBeenCalled();
				done();
			};

			lib.chaos({ seed: "LcjNZUJiBYyXmpQ" })(req, res, next);
		}));

	it("should override probability", () =>
		new Promise<void>((done) => {
			const delaySpy = vi.spyOn(lib.Rules, "DELAY");
			const req = vi.fn() as unknown as Request;
			const res = vi.fn() as unknown as Response;
			const next = () => {
				expect(delaySpy).toHaveBeenCalled();
				//@ts-ignore
				done();
			};

			lib.chaos({
				seed: "Bn4tHP7XNDLYtsk",
				probability: 75,
			})(req, res, next);
		}));

	it("should override rules", () =>
		new Promise<void>((done) => {
			const delaySpy = vi.spyOn(lib.Rules, "DELAY");
			const req = vi.fn() as unknown as Request;
			const res = vi.fn() as unknown as Response;
			const next = () => {
				expect(delaySpy).toHaveBeenCalled();
				//@ts-ignore
				done();
			};

			lib.chaos({
				seed: "HXoXdi8CPxHiLLd",
				rules: [lib.Rules.DELAY],
				maxDelay: 200,
			})(req, res, next);
		}));

	it("should throw error if probability value is invalid (not a number)", () => {
		//@ts-ignore
		expect(() => lib.chaos({ probability: "a" })).toThrow(Error);
	});

	it("should throw error if probability value is invalid ( < 0 )", () => {
		expect(() => lib.chaos({ probability: -5 })).toThrow(Error);
	});

	it("should throw error if probability value is invalid ( > 100 )", () => {
		expect(() => lib.chaos({ probability: 200 })).toThrow(Error);
	});
});
