import { IControl } from '~~/lib/interfaces/IControl';
import Parameter from '~~/lib/wrappers/Parameter';

export default function(operation: string, parameter: Parameter): void {
  const value: any = operation === 'endEdit' ? {value: parameter.value} : {};
  useWebsockets().send(JSON.stringify({
    resource: 'synthesizer',
    operation,
    synthesizer_id: useSynthesizerDetails().synthesizer.id,
    parameter_id: parameter.id,
    module_id: parameter.mod.id,
    ...value,
  }));
}