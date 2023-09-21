export type ParamsChecker<T, R = boolean | string> = {
  assert(val: unknown, onFail: (errors: Record<keyof T, R>) => Error): asserts val is T;
  isValid(val: unknown): val is T;
  errors: () => Record<keyof T, R>;
};

export function createParamsChecker<T, R = boolean | string>(assertedMap: Record<string, R>): ParamsChecker<T, R> {
  let errors: Record<keyof T, R>;
  const isValid = (val: unknown): val is T => {
    const errorKeys = Object.keys(assertedMap).filter(key => {
      const assertedValue = assertedMap[key];
      return typeof assertedValue === "string" ? assertedValue : !assertedValue;
    });
    errors = errorKeys.reduce(
      (errorsMap, errorKey) => {
        errorsMap[errorKey] = assertedMap[errorKey];
        return errorsMap;
      },
      {} as Record<keyof T, R>
    );
    return errorKeys.length === 0;
  };

  return {
    assert(val: unknown, onFail: (errors: Record<keyof T, R>) => Error): asserts val is T {
      if (!isValid(val)) {
        throw onFail(errors);
      }
    },
    isValid,
    errors: () => errors,
  };
}

export function isValidDate(val: any): boolean {
  return (typeof val === "string" || typeof val === "number") && !isNaN(new Date(val).getTime());
}
