import { DriveEVService } from './driveEv';
import { DealerShipType, ProgramType, EVType, discountConditions, REBATE } from '../constant';

export class DriverEVPlusService extends DriveEVService {
  householdSize: number;
  period: number;
  income: number;

  constructor(
    purchaseOrLeaseDate: Date, dealerShipType: DealerShipType, driverLicense: string,
    dealerShipAddress: string, programType: ProgramType, evType: EVType, 
    householdSize: number, period: number, income: number, leaseTerm: number,
    ) {
    super(
      purchaseOrLeaseDate, dealerShipType, driverLicense,
      dealerShipAddress, programType, evType, leaseTerm, 
    );
    this.householdSize = householdSize;
    this.period = period;
    this.income = income;
  }

  checkMatchDiscountConditions() {
    const houseHouse = discountConditions.find(condition => 
      condition.householdSize === this.householdSize && condition.months === this.period
    );
    if (houseHouse) return houseHouse.income <= this.income;
    return false;
  }

  getPlusPurchaseRebateAmount() {
    switch (this.evType) {
      case 'BEV':
      case 'FCEV':
        return REBATE.PLUS_PURCHASE_AMOUNT_BEV_FCEV;
      case 'PHEV':
        return REBATE.PLUS_PURCHASE_AMOUNT_PHEV;
      default: return 0;
    }
  }

  getPlusLeaseRebaseAmount() {
    switch (this.evType) {
      case 'BEV':
      case 'FCEV':
        return REBATE.PLUS_LEASE_AMOUNT_BEV_FCEV;
      case 'PHEV':
        return REBATE.PLUS_LEASE_AMOUNT_PHEV;
      default: return 0;
    }
  }

  getTotalRebateAmount() {
    const EVRebateResult = this.getRebateAmount();
    if (EVRebateResult.status === 'success') {
      const isDiscount = this.checkMatchDiscountConditions();
      if (!isDiscount) {
        return {
          status: 'error',
          discount: EVRebateResult.discount,
          errors: [
            'Your income do not meet the EV+ program\'s conditions, check information in the link'
          ],
          linkProgram: 'https://drive.ri.gov/ev-programs/drive-plus'
        }
      } else {
        const bonusDiscount = this.programType === 'Purchase' ? this.getPlusPurchaseRebateAmount() : this.getPlusLeaseRebaseAmount();
        return {
          status: 'success',
          message: 'Congratulation, you are eligible to receive discounts from the DriverEV+ !',
          discount: EVRebateResult.discount + bonusDiscount,
          currency: 'USD'
        }
      }
    } 
    return EVRebateResult;
  }

}