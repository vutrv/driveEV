export const evTypes = [
    { value: 'BEV', label: 'BEV' },
    { value: 'FCEV', label: 'FCEV' },
    { value: 'PHEV', label: 'PHEV' },
  ];

export enum ProgramType {
    Purchase = 'Purchase',
    Lease = 'Lease'
}

export type EVType = 'BEV' | 'FCEV' | 'PHEV';