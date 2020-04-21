
import { expect } from 'chai';
import { Optional } from '../src/Optional';

const presetValueFn = (value: string) => {
    return (input: string) => value;
};

const presetOptionalValueFn = (value: string) => {
    return (input: string): Optional<String> => new Optional(value);
};

const errorOnInvokeFn = (errorMsg: string) => {
    return (_: string) => new Error(errorMsg);
};

describe('Optional.empty', () => {
    let opt: Optional<string>;

    before(() => {
        opt = Optional.empty<string> ();
    });

    it('throws an exception if invoking get', (done) => {
        try {
            opt.get();
            done(new Error('Should throw an exception'));
        } catch (err) {
            done();
        }
    });

    it('returns true when invoking isEmpty', () => {
        expect(opt.isEmpty()).to.equal(true);
    });

    it('returns false when invoking isPresent', () => {
        expect(opt.isPresent()).to.equal(false);
    });

    it('does not invoke ifPresent consumer', (done) => {
        const consumer = (value: String) => {
            done(new Error('Should not be invoked'));
        };
        opt.ifPresent(consumer);
        done();
    });

    it('stream does return immediately', () => {
        let total = 0;
        for (let {} of opt) {
            total = total + 1;
        }
        expect(total).to.equal(0);
    });

    describe('ifPresentOrElse', () => {
        it('invokes the emptyFn when no value is present', () => {
            let argument = "notSet";
            const consumer = () => {
                argument = "set";
            };
            opt.ifPresentOrElse(() => {}, consumer);
            expect(argument).to.equals("set");
        });
    });

    it('does not invoke the filter function', (done) => {
        opt.filter((_: string): boolean => {
            done(new Error('Should not be invoked'));
            return false;
        });
        done();
    });

    it('does return an empty optional when invoking map', (done) => {
        try {
            expect(opt.map((_: string): boolean => {
                done(new Error('Should not be invoked'));
                return true;
            }).get());
            done(new Error('Should not be reach this point'));
        } catch (err) {
            done();
        }
    });

    it('does return an empty optional when invoking flatmap', (done) => {
        try {
            expect(opt.flatMap((_: string): Optional<boolean> => {
                done(new Error('Should not be invoked'));
                return new Optional<boolean>(true);
            }).get());
            done(new Error('Should not be reach this point'));
        } catch (err) {
            done();
        }
    });

    it('does return the other when orElse', () => {
        expect(opt.orElse('goodbye')).to.equals('goodbye');
    });

    describe('or', () => {
        it('does throw an error if function is null', (done) => {
            try {
                expect(opt.or(undefined));
                done(new Error('Should not be reach this point'));
            } catch (err) {
                done();
            }
        });

        it('does return the value from the function', () => {
            const result = opt.or(() => new Optional('hello'));
            expect(result.get()).to.equals('hello');
        });

        it('throws an error if provided function returns null value', (done) => {
            try {
                opt.or(() => undefined);
                done(new Error('Should not be reach this point'));
            } catch (err) {
                done();
            }
        });
    });

    describe('orElseGet', () => {
        it('does invoke the supplier', () => {
            expect(opt.orElseGet(() => 'invoked')).to.equals('invoked');
        });

        it('does throw an exception if the supplier is null', (done) => {
            try {
                opt.orElseGet(undefined);
                done(new Error('Should throw an exception'));
            } catch (err) {
                done();
            }
        });
    });

    describe('orElseThrow', () => {
        it('invokes the exception supplier', (done) => {
            try {
                opt.orElseThrow(() => new Error('Throw up'));
                done(new Error('Should have thrown an exception'));
            } catch (err) {
                done();
            }
        });

        it('does throw an exception if the supplier is null', (done) => {
            try {
                opt.orElseThrow(undefined);
            } catch (err) {
                done();
            }
        });
    });
});

describe('Optional.of', () => {
    let opt: Optional<string>;

    before(() => {
        opt = Optional.of('hello');
    });

    describe('creation', () => {
        it('can invoke get successfully', () => {
            expect(opt.get()).to.equals('hello');
        });

        it('throws an exception when creating with a null value', (done) => {
            try {
                Optional.of(undefined);
                done(new Error('Should throw an exception'));
            } catch (err) {
                done();
            }
        });
    });

    describe('isPresent', () => {
        it('returns true when invoking isPresent', () => {
            expect(opt.isPresent()).to.be.true;
        });
    });

    describe('isEmpty', () => {
        it('returns false when invoking isEmpty', () => {
            expect(opt.isEmpty()).to.be.false;
        });
    });

    describe('ifPresent', () => {
        it('throws an error if the function is null/undefined', (done) => {
            try {
                opt.ifPresent(undefined);
                done(new Error('Should fail on ifPresent with null function'));
            } catch (err) {
                done();
            }
        });

        it('invokes the consumer and keeps the value', () => {
            const input: string = 'hello';
            let argument: string;
            const consumer = (inx: string) => {
                argument = inx;
            };
            const result = opt.ifPresent(consumer);
            expect(argument)
                .equals(input);
        });
    });

    describe('ifPresentOrElse', () => {
        it('invokes the nonEmptyFn if value present and keeps the value', () => {
            const input: string = 'hello';
            let argument: string;
            const consumer = (inx: string) => {
                argument = inx;
            };
            opt.ifPresentOrElse(consumer, () => {});
            expect(argument).to
                .equals(input);
        });
    });

    describe('filter', () => {
        it('invokes the filter that evals to true', () => {
            const filter = (input: String) => true;
            const result = opt.filter(filter);
            expect(result.get()).to
                .equals('hello');
        });

        it('invokes the filter that evals to false', (done) => {
            const filter = (input: String) => false;
            const result = opt.filter(filter);
            try {
                result.get();
                done(new Error('Evaluating empty one'));
            } catch (err) {
                done();
            }
        });
    });

    describe('map', () => {
        it('creates an empty optional when the mapper returns null', (done) => {
            const result = opt.map(presetValueFn(undefined));
            try {
                result.get();
                done(new Error('Evaluating empty optional'));
            } catch (err) {
                done();
            }
        });

        it('creates an optional when the mapper returns not null', () => {
            const result = opt.map(presetValueFn('goodbye'));
            expect(result.get()).to.equals('goodbye');
        });
    });

    describe('flatMap', () => {
        it('throws an exception if the mapper returns null', (done) => {
            try {
                opt.flatMap((value: string) => undefined);
                done(new Error('Should throw an exception when returning null'));
            } catch (err) {
                done();
            }
        });
    });

    describe('or', () => {
        it('returns the inner value', () => {
            expect(opt.or(() => new Optional<string>('goodbye')).get()).to.equals('hello');
        });
    });

    describe('orElses', () => {
        it('returns the defined value when invoking orElse', () => {
            expect(opt.orElse('goodbye')).to.equals('hello');
        });

        it('returns the defined value when invoking orElseGet', () => {
            expect(opt.orElseGet((): string => 'goodbye')).to.equals('hello');
        });

        it('returns the defined value when invoking orElseThrow', () => {
            expect(opt.orElseThrow(() => new Error('Should not invoke'))).to.equals('hello');
        });
    });

    it('stream does not return immediately', () => {
        let total = 0;
        let result = 'notset';

        for (let value of opt) {
            total++;
            result = value;
        }
        expect(total).to.be.equal(1);
        expect(result).to.equals('hello');
    });

    it('is able to iterate over same optional multiple times', () => {
        let total: number = 0;

        for ({} of opt) {
            total = total + 1;
        }
        for ({} of opt) {
            total = total + 1;
        }
        expect(total).to.be.equal(2);
    });
});

describe('Optional.ofNullable', () => {
    it('does not throw an exception on creation with null value', () => {
        const opt = Optional.ofNullable(undefined);
        expect(opt.isPresent()).to.be.false;
    });

    it('does not throw an exception on creation with non null value', () => {
        const opt = Optional.ofNullable('hello');
        expect(opt.isPresent()).to.be.true;
        expect(opt.get()).to.equals('hello');

    });
});
