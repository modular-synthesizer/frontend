export async function loadProcessors(context: AudioContext) {
  const uri: string = useRuntimeConfig().public.processors_url;
  await context.audioWorklet.addModule(`${uri}/processors.js`);
}