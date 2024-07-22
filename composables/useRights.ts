const rights: Ref<string[]> = ref([]);

export function setRights(value: string[] = []) {
  rights.value = value;
}

export function hasRight(right: string): boolean {
  return rights.value.includes(right);
}