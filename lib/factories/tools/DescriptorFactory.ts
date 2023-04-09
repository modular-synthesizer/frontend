import IDescriptor from "~~/lib/interfaces/tools/IDescriptor";

class DescriptorFactory {
  public empty(): IDescriptor {
    return {default: 0, maximum: 10, minimum: 10, step: 1, precision: 0};
  }
}

export const factory = new DescriptorFactory();