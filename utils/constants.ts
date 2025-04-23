export const EMAIL_FORMAT: RegExp = /\A([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)\Z/

export const SLOT_SIZE = 20;

export const RACK_HEIGHT: number = 400;

// This value is kind of magic. It has been determined after trials and
// errors as the best value to apply to the wheel scroll to zoom in and
// out smoothly without it being too fast or too slow.
export const ZOOM_RATIO = 0.005;

// This value is the maximum value the ratio can be "zoomed out" with
// It is a magic value obtained after some trials and errors too.
export const MAX_ZOOM_OUT = 0.5;

// This value is the maximum value the ratio can be "zoomed in" with
// It is a magic value obtained after some trials and errors too.
export const MAX_ZOOM_IN = 2;

// We sometimes must subtract the top bar height to coordinates and we
// don't want to duplicate magic value so we store it here.
export const TOPBAR_HEIGHT = 64;

export const PORT_RADIUS = 6;

export const POLYPHONY_CHANNELS = 16;

export const GATES_INTERVAL = 5;

export const DEFAULT_FADER_HEIGHT = 180;

export const TITLE_HEIGHT = 40;
export const PARAM_HEIGHT = 30;
export const PORT_HEIGHT = 20;
export const NODE_WIDTH = 180;

export const BG_SIZE = 60;