function isNullOrUndefined(value: any): boolean {
  return (value === undefined || value === null);
}

function assertOn(condition: boolean, errorMessage: string): void {
  if (condition) {
    throw new Error(errorMessage);
  }
}

/**
 * A container object which may or may not contain a non-null value. If a value is present, isPresent() returns true.
 * If no value is present, the object is considered empty and isPresent() returns false.
 *
 * Additional methods that depend on the presence or absence of a contained value are provided, such as orElse()
 * (returns a default value if no value is present) and ifPresent() (performs an action if a value is present).
 *
 * API Note: Optional is primarily intended for use as a method return type where there is a clear need to represent
 * "no result," and where using null is likely to cause errors. A variable whose type is Optional should never itself
 * be null; it should always point to an Optional instance.
 */
// tslint:disable-next-line: no-single-line-block-comment
export class Optional<T> {
  readonly #value?: T;

  /**
   * Returns an Optional describing the specified value, if non-null, otherwise returns an empty Optional.
   */
  static ofNullable<T>(value?: T) {
    return new Optional(value);
  }

  /**
   * Returns an Optional with the specified present non-null value. If null or undefined,
   * it will throw an Error.
   *
   * @throws error if value is null or undefined
   */
  // tslint:disable-next-line: no-reserved-keywords
  static of<T> (value: T): Optional<T> {
    assertOn(isNullOrUndefined(value), 'NullPointerException : value is not defined');

    return new Optional(value);
  }

  /**
   * Returns an empty Optional instance. No value is present for this Optional.
   */
  static empty<T>(): Optional<T> {
    return new Optional(undefined);
  }

  /**
   * Creates an instance of Optional.
   */
  constructor(value: T) {
    this.#value = value;
  }

  /**
   * If a value is present in this Optional, returns the value, otherwise throws Error.
   *
   * @throws error if no value is present
   */
  // tslint:disable-next-line: no-reserved-keywords
  get(): T {
    assertOn(this.isEmpty(), 'Can not invoke get on Optional with null/undefined value');

    return this.#value;
  }

  /**
   * If a value is not present, returns true, otherwise false.
   */
  isEmpty(): boolean {
    return isNullOrUndefined(this.#value);
  }

  /**
   * Returns true if there is a value present, otherwise false.
   */
  isPresent(): boolean {
    return !this.isEmpty();
  }

  /**
   * If a value is present, invoke the specified fn with the value, otherwise do nothing.
   *
   * @param fn with the value as an argument
   */
  ifPresent(fn?: (value: T) => void) {
    if (this.isPresent()) {
      fn(this.#value);
    }
  }

  /**
   * If a value is present, performs the given action with the value, otherwise performs the given empty-based action.
   *
   * @param nonEmptyFn the function to be invoked, if a value is present with that value as argument.
   * @param emptyFn the empty-based action to be invoked, if no value is present.
   */
  ifPresentOrElse(nonEmptyFn: (value: T) => void, emptyFn: () => void): void {
    if (this.isPresent()) {
      nonEmptyFn(this.#value);
    } else {
      emptyFn();
    }
  }

  /**
   * If a value is present, and the value matches the given predicate,
   * return an Optional describing the value, otherwise return an empty Optional.
   *
   * @param fn filter function that takes the value as an argument.
   */
  filter(fn: (value: T) => boolean): Optional<T> {
    if (this.isEmpty()) {
      return this;
    } else {
      return (fn(this.#value)) ? new Optional(this.#value) : new Optional(undefined);
    }
  }

  /**
   * If a value is present, apply the provided mapping function to it,
   * and if the result is non-null, return an Optional describing the result.
   *
   * @param fn with the value as an argument
   */
  map<U> (fn: (value: T) => U): Optional<U> {
    if (this.isEmpty()) {
      return new Optional<U> (undefined);
    } else {
      return new Optional(fn(this.#value));
    }
  }

  /**
   * If a value is present, apply the provided Optional-bearing mapping function to it,
   * return that result, otherwise return an empty Optional.
   *
   * @param fn mapping function that takes the value as argument
   * @throws error if the mapping function is null or returns a null result
   */
  flatMap<U> (fn: (value: T) => Optional<U>): Optional<U> {
    if (this.isEmpty()) {
      return new Optional<U>(undefined);
    } else {
      const result: Optional<U> = fn(this.#value);
      assertOn(isNullOrUndefined(result), 'Mapping function cannot return null/undefined value');

      return result;
    }
  }

  /**
   * Return the value if present, otherwise return other.
   */
  orElse (other: T): T {
    return this.isPresent() ? this.#value : other;
  }

  /**
   * Return the value if present, otherwise invoke fn  and return the result of that invocation.
   */
  orElseGet (fn: () => T): T {
    return (this.isPresent()) ? this.#value : fn();
  }

  /**
   * If a value is present, returns an Optional describing the value, otherwise returns an Optional produced
   * by the supplying function.
   *
   * @param fn the supplying function that produces an Optional to be returned
   *
   * @returns an Optional describing the value of this Optional, if a value is present,
   *          otherwise an Optional produced by the supplying function.
   *
   * @throws if provided function produces a null result.
   */
  or(fn: () => Optional<T>): Optional<T> {
    if (this.isPresent()) {
      return this;
    } else {
      const result: Optional<T> = fn();
      assertOn(isNullOrUndefined(result), 'provided function returns null or undefined result');

      return result;
    }
  }

  /**
   * Return the contained value, if present, otherwise throw an exception to be created by the provided fn.
   */
  orElseThrow (fn: () => void): T {
    if (this.isPresent()) {
      return this.#value;
    } else {
      throw fn();
    }
  }

  /**
   * If a value is present, returns an iterable containing only that value, otherwise returns an empty iterable.
   */
  *[Symbol.iterator]() {
    if (this.isPresent()) {
      yield this.#value;
    }

    return;
  }
}
