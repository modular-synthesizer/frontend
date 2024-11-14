import axios from "axios";

const EXCLUDED = ['ControlsWrapper']

export function useControls() {
  return {
    async fetch() {
      const controls: string[] = (await axios.get('/json/controls.json')).data;
      const filtered: string[] = controls.filter((name: string) => EXCLUDED.indexOf(name) < 0);
      return filtered.map((name: string) => name.replace('Controls', ''));
    }
  }
}