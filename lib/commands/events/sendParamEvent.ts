import type { Parameter } from '~/types/modules/Parameter';
import sendEvent from './sendEvent';

export default function(operation: string, parameter: Parameter): void {
  const value: any = operation === 'endEdit' ? {value: parameter.value} : {};
  sendEvent({
    resource: 'synthesizer',
    operation,
    synthesizer_id: useSynthesizer().synthesizer.value.id,
    parameter_id: parameter.id,
    module_id: parameter.mod.id,
    ...value,
  });
}