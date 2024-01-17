import { CheckValidUserData } from './common';

enum EVType {
  BEVs = 'BEVs',
  FCEVs = 'FCEVs'
}

export class NewElectricVehicleRebate extends CheckValidUserData {
  private static readonly MAX_AGREED_VALUE = 60000;
  private static readonly REBATE_AMOUNT_BEV_FCEV = 1500;
  private static readonly REBATE_AMOUNT_PHEV = 1000;

  checkEVType(): EVType {
    /* Logic to check if it's a BEV or FCEV */
    // In this case i return the BEVs for example
    return EVType.BEVs;
  }

  getRebateAmount(): number {
    if (this.isValidAgreedValue(NewElectricVehicleRebate.MAX_AGREED_VALUE)) {
      const evType = this.checkEVType();
      if (
        evType === EVType.BEVs
      ) {
        return NewElectricVehicleRebate.REBATE_AMOUNT_BEV_FCEV;
      } else {
        return NewElectricVehicleRebate.REBATE_AMOUNT_PHEV;
      }
    }
    return 0;
  }

  // Additional methods or properties specific to new electric vehicles can be added here
}

export class UsedElectricVehicleRebate extends CheckValidUserData {
  private static readonly MAX_AGREED_VALUE = 40000;
  private static readonly REBATE_AMOUNT_BEV_FCEV = 1000;
  private static readonly REBATE_AMOUNT_PHEV = 750;

  checkEVType() {
    /* Logic to check if it's a BEV or FCEV */
    // In this case i return the BEVs for example
    return EVType.BEVs;
  }

  getRebateAmount(): number {
    if (this.isValidAgreedValue(UsedElectricVehicleRebate.MAX_AGREED_VALUE)) {
      const evType = this.checkEVType();
      if (evType === EVType.BEVs) {
        return UsedElectricVehicleRebate.REBATE_AMOUNT_BEV_FCEV;
      } else {
        return UsedElectricVehicleRebate.REBATE_AMOUNT_PHEV;
      }
    }
    return 0;
  }

  // Additional methods or properties specific to used electric vehicles can be added here
}

// Example usage:
// const newEVRebate = new NewElectricVehicleRebate(new Date(), 55000);
// const usedEVRebate = new UsedElectricVehicleRebate(new Date(), 30000);

