interface header {
  title: string,
  key?: string
};

export function useHeaders(translator: any, headers: header[]): header[] {
  const { t } = translator();
  return headers.map((h: header) => ({ title: t(h.title), key: h.key }));
}