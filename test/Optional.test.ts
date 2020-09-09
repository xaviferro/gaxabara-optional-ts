import { Optional } from '../src/Optional';

const identifyFn = (value: String) => {
    return (input: String) => value;
};

const identityOptionalFn = (value: String) => {
    return (input: string): Optional<String> => new Optional(value);
};

describe('Optional.empty', () => {
    const opt: Optional<String> = Optional.empty<String> ();

    it('throws an exception if invoking get', (done) => {
        try {
            opt.get();
            done(new Error('Should throw an exception'));
        } catch (err) {
            done();
        }
    });

    it('returns true when invoking isEmpty', () => {
        expect(opt.isEmpty()).toBe(true);
    });

    it('returns false when invoking isPresent', () => {
        expect(opt.isPresent()).toBe(false);
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
        expect(total).toBe(0);
    });

    describe('ifPresentOrElse', () => {
        it('invokes the emptyFn when no value is present', () => {
            let argument = 'notSet';
            const consumer = () => {
                argument = 'set';
            };
            opt.ifPresentOrElse(() => {}, consumer);
            expect(argument).toBe('set');
        });
    });

    it('does not invoke the filter function', (done) => {
        opt.filter((_: String): boolean => {
            done(new Error('Should not be invoked'));

            return false;
        });
        done();
    });

    it('does return an empty optional when invoking map', (done) => {
        try {
            expect(opt.map((_: String): boolean => {
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
            expect(opt.flatMap((_: String): Optional<boolean> => {
                done(new Error('Should not be invoked'));
                return new Optional<boolean>(true);
            }).get());
            done(new Error('Should not be reach this point'));
        } catch (err) {
            done();
        }
    });

    it('does return the other when orElse', () => {
        expect(opt.orElse('goodbye')).toBe('goodbye');
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
            expect(result.get()).toBe('hello');
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
            expect(opt.orElseGet(() => 'invoked')).toBe('invoked');
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
    const opt: Optional<string> = Optional.of('hello');

    describe('creation', () => {
        it('can invoke get successfully', () => {
            expect(opt.get()).toBe('hello');
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
            expect(opt.isPresent()).toBe(true);
        });
    });

    describe('isEmpty', () => {
        it('returns false when invoking isEmpty', () => {
            expect(opt.isEmpty()).toBe(false)
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
            const input: String = 'hello';
            let argument: String;
            const consumer = (inx: String) => {
                argument = inx;
            };
            const result = opt.ifPresent(consumer);
            expect(argument).toBe(input);
        });
    });

    describe('ifPresentOrElse', () => {
        it('invokes the nonEmptyFn if value present and keeps the value', () => {
            const input: String = 'hello';
            let argument: String;
            const consumer = (inx: String) => {
                argument = inx;
            };
            opt.ifPresentOrElse(consumer, () => {});
            expect(argument).toBe(input);
        });
    });

    describe('filter', () => {
        it('invokes the filter that evals to true', () => {
            const filter = (input: String) => true;
            const result = opt.filter(filter);
            expect(result.get()).toBe('hello');
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
            const result = opt.map(identifyFn(undefined));
            try {
                result.get();
                done(new Error('Evaluating empty optional'));
            } catch (err) {
                done();
            }
        });

        it('creates an optional when the mapper returns not null', () => {
            const result = opt.map(identifyFn('goodbye'));
            expect(result.get()).toBe('goodbye');
        });
    });

    describe('flatMap', () => {
        it('throws an exception if the mapper returns null', (done) => {
            try {
                opt.flatMap((value: String) => undefined);
                done(new Error('Should throw an exception when returning null'));
            } catch (err) {
                done();
            }
        });

        it('returns the value', () => {
            expect(opt.flatMap(identityOptionalFn('flatMap')).get()).toBe('flatMap');
        });
    });

    describe('or', () => {
        it('returns the inner value', () => {
            expect(opt.or(() => new Optional<string>('goodbye')).get()).toBe('hello');
        });
    });

    describe('orElses', () => {
        it('returns the defined value when invoking orElse', () => {
            expect(opt.orElse('goodbye')).toBe('hello');
        });

        it('returns the defined value when invoking orElseGet', () => {
            expect(opt.orElseGet((): string => 'goodbye')).toBe('hello');
        });

        it('returns the defined value when invoking orElseThrow', () => {
            expect(opt.orElseThrow(() => new Error('Should not invoke'))).toBe('hello');
        });
    });

    it('stream does not return immediately', () => {
        let total = 0;
        let result: string = 'notset';

        for (const value of opt) {
            total++;
            result = value;
        }
        expect(total).toBe(1);
        expect(result).toBe('hello');
    });

    it('is able to iterate over same optional multiple times', () => {
        let total: number = 0;

        for ({} of opt) {
            total = total + 1;
        }
        for ({} of opt) {
            total = total + 1;
        }
        expect(total).toBe(2);
    });
});

describe('Optional.ofNullable', () => {
    it('does not throw an exception on creation with null value', () => {
        const opt = Optional.ofNullable(undefined);
        expect(opt.isPresent()).toBe(false);
    });

    it('does not throw an exception on creation with non null value', () => {
        const opt = Optional.ofNullable('hello');
        expect(opt.isPresent()).toBe(true);
        expect(opt.get()).toBe('hello');

    });
});
