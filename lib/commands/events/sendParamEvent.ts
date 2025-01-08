import type { Parameter } from '~/types/modules/Parameter';
import sendEvent from './sendEvent';
import type { Synthesizer } from '~/types/Index';

export default function(operation: string, parameter: Parameter, synthesizer: Synthesizer): void {
  const value: any = operation === 'endEdit' ? {value: parameter.value} : {};
  sendEvent({
    resource: 'synthesizer',
    operation,
    synthesizer_id: synthesizer.id,
    parameter_id: parameter.id,
    module_id: parameter.mod.id,
    ...value,
  });
}