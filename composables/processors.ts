import { api } from '~~/lib/api/Api';

export async function loadProcessors(context: AudioContext) {
  const processors = await api.auth_get('/processors');
  for (let processor of processors) {
    await context.audioWorklet.addModule(processor.url);
  }
}