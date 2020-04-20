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
  ifPresent(fn: Function) {
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
  ifPresentOrElse(nonEmptyFn: Function, emptyFn: Function): void {
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
  filter(fn: Function): Optional<T> {
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
  map(fn: Function): Optional<T> {
    if (this.isEmpty()) {
      return this;
    } else {
      return new Optional(fn(this.#value));
    }
  }

  /**
   * If a value is present, apply the provided Optional-bearing mapping function to it,
   * return that result, otherwise return an empty Optional.
   *
   * @param fn mapping function that takes the value as argument
   */
  flatMap(fn: Function): Optional<T> {
    if (this.isEmpty()) {
      return this;
    } else {
      const flatMappedValue: Optional<T> = fn(this.#value);
      assertOn(isNullOrUndefined(flatMappedValue), 'Mapper must not return a null or undefined value');

      return flatMappedValue;
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
  orElseGet (fn: Function): T {
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
   */
  or(fn: Function): Optional<T> {
    if (this.isPresent()) {
      return this;
    } else {
      return new Optional(fn());
    }
  }

  /**
   * Return the contained value, if present, otherwise throw an exception to be created by the provided fn.
   */
  orElseThrow (fn: Function): T {
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
