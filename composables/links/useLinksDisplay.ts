
const displayed: Ref<boolean> = ref(true);

function toggle() {
  displayed.value = !displayed.value;
}

export const useLinksDisplay = () => {
  return { toggle, displayed}
}
