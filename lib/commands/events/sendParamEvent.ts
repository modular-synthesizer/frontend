import Parameter from '~~/lib/wrappers/Parameter';
import sendEvent from './sendEvent';

export default function(operation: string, parameter: Parameter): void {
  const value: any = operation === 'endEdit' ? {value: parameter.value} : {};
  sendEvent({
    resource: 'synthesizer',
    operation,
    synthesizer_id: useSynthesizerDetails().synthesizer.id,
    parameter_id: parameter.id,
    module_id: parameter.mod.id,
    ...value,
  });
}