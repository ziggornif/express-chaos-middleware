const lib = require('./index');

describe('Express chaos middleware', () => {
  beforeEach(() => jest.clearAllMocks);
  it('should slow application', (done) => {
    const randomSpy = jest.spyOn(Math, 'random').mockImplementationOnce(() => 0.1);
    const randomRulesSpy = jest.spyOn(Math, 'random').mockImplementationOnce(() => 0);
    const randomDelaySpy = jest.spyOn(Math, 'random').mockImplementationOnce(() => 0.1);
    const delaySpy = jest.spyOn(lib.Rules, 'DELAY');
    const req = jest.fn();
    const res = jest.fn();
    const next = () => {
      expect(randomSpy).toHaveBeenCalled();
      expect(randomRulesSpy).toHaveBeenCalled();
      expect(randomDelaySpy).toHaveBeenCalled();
      expect(delaySpy).toHaveBeenCalled();
      done();
    };

    lib.chaos()(req, res, next);
  });

  it('should return http error', (done) => {
    const randomSpy = jest.spyOn(Math, 'random').mockImplementationOnce(() => 0.1);
    const randomRulesSpy = jest.spyOn(Math, 'random').mockImplementationOnce(() => 0.4);
    const httpErrSpy = jest.spyOn(lib.Rules, 'HTTPERROR');
    const req = jest.fn();
    const res = {
      statusCode: 200,
      end: () => {
        expect(randomSpy).toHaveBeenCalled();
        expect(randomRulesSpy).toHaveBeenCalled();
        expect(httpErrSpy).toHaveBeenCalled();
        done();
      },
    };

    lib.chaos()(req, res);
  });

  it('should throw error', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockImplementationOnce(() => 0.1);
    const randomRulesSpy = jest.spyOn(Math, 'random').mockImplementationOnce(() => 0.8);
    const exceptionSpy = jest.spyOn(lib.Rules, 'EXCEPTION');
    const req = jest.fn();
    expect(() => lib.chaos()(req)).toThrow(Error);
    expect(randomSpy).toHaveBeenCalled();
    expect(randomRulesSpy).toHaveBeenCalled();
    expect(exceptionSpy).toHaveBeenCalled();
  });

  it('should skip chaos function', (done) => {
    const randomSpy = jest.spyOn(Math, 'random').mockImplementationOnce(() => 0.5);
    const req = jest.fn();
    const res = jest.fn();
    const next = () => {
      expect(randomSpy).toHaveBeenCalled();
      done();
    };

    lib.chaos()(req, res, next);
  });

  it('should override probability', (done) => {
    const randomSpy = jest.spyOn(Math, 'random').mockImplementationOnce(() => 0.8);
    const req = jest.fn();
    const res = jest.fn();
    const next = () => {
      expect(randomSpy).toHaveBeenCalled();
      done();
    };

    lib.chaos({
      probability: 75,
    })(req, res, next);
  });

  it('should override rules', (done) => {
    const randomSpy = jest.spyOn(Math, 'random').mockImplementationOnce(() => 0.1);
    const randomRulesSpy = jest.spyOn(Math, 'random').mockImplementationOnce(() => 0);
    const randomDelaySpy = jest.spyOn(Math, 'random').mockImplementationOnce(() => 0.1);
    const delaySpy = jest.spyOn(lib.Rules, 'DELAY');
    const req = jest.fn();
    const res = jest.fn();
    const next = () => {
      expect(randomSpy).toHaveBeenCalled();
      expect(randomRulesSpy).toHaveBeenCalled();
      expect(randomDelaySpy).toHaveBeenCalled();
      expect(delaySpy).toHaveBeenCalled();
      done();
    };

    lib.chaos({
      rules: [lib.Rules.DELAY],
      maxDelay: 200,
    })(req, res, next);
  });

  it('should throw error if probability value is invalid (not a number)', () => {
    expect(() => lib.chaos({ probability: 'a' })).toThrow(Error);
  });

  it('should throw error if probability value is invalid ( < 0 )', () => {
    expect(() => lib.chaos({ probability: -5 })).toThrow(Error);
  });

  it('should throw error if probability value is invalid ( > 100 )', () => {
    expect(() => lib.chaos({ probability: 200 })).toThrow(Error);
  });
});
