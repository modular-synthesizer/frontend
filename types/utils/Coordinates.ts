export type Coordinates = {
    x: number, y: number
};

export type ScaledCoordinates = Coordinates & {
    scale: number;
}