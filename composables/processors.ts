import { api } from '~~/lib/api/Api';

export async function loadProcessors(context: AudioContext) {
  const processors = await api.auth_get('/processors');
  for (let processor of processors) {
    const uri = `/proxy/processors/${processor.id}?auth_token=${useAuthentication().token}`;
    await context.audioWorklet.addModule(uri);
  }
  await context.audioWorklet.addModule("http://localhost:3000/processors/envelope_processor.js")
}