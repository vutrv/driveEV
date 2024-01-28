export enum Period {
    '12MONTHS' = 12,
    '3MONTHS' = 3,
    '1MONTH' = 1
}

export const periodOptions = [
    { value: Period["12MONTHS"], label: Period["12MONTHS"] },
    { value: Period["3MONTHS"], label: Period["3MONTHS"] },
    { value: Period["1MONTH"], label: Period["1MONTH"] },
];