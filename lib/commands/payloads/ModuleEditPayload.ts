export interface ModuleEditPayload {
  module_id: string;
  rack: number;
  slot: number;
  synthesizer_id: string;
  operation: string;
  resource: string;
}