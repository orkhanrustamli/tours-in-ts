export function autoBinder(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalFunc = descriptor.value;

  const newDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      return originalFunc.bind(this);
    },
  };

  return newDescriptor;
}
