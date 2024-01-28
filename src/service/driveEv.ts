import { DealerShipType, auto_ri_address, auto_out_of_state_address, ProgramType, EVType, REBATE } from '../constant';

export class DriveEVService {
  purchaseOrLeaseDate: Date;
  dealerShipType: DealerShipType;
  dealerShipAddress: string;
  programType: ProgramType;
  evType: EVType;
  leaseTerm?: number;
  driverLicense: string;

  constructor(
    purchaseOrLeaseDate: Date, dealerShipType: DealerShipType, driverLicense: string,
    dealerShipAddress: string, programType: ProgramType, evType: EVType, leaseTerm?: number,
    ) {
    this.purchaseOrLeaseDate = purchaseOrLeaseDate;
    this.dealerShipType = dealerShipType;
    this.dealerShipAddress = dealerShipAddress;
    this.programType = programType;
    this.evType = evType;
    this.leaseTerm = leaseTerm;
    this.driverLicense = driverLicense;
  }

  checkValidPurchaseOrLeaseDate() {
    const startDate = new Date('2022-07-07');
    if (new Date(this.purchaseOrLeaseDate) >= startDate) {
      return {
        status: 'success',
        message: 'Valid date'
      }
    } else return {
      status: 'error',
      message: 'Date must be greater than or equal 2022-07-07'
    }
  }

  checkLeaseTermLongEnough() {
    if (this.programType === ProgramType.Lease && this.leaseTerm) {
      if (this.leaseTerm >= 24) {
        return {
          status: 'success',
          message: 'Valid lease term'
        }
      } 
      return {
        status: 'error',
        message: 'Lease term must be greater than or equal 24 months'
      }
    } else return {
      status: 'success',
    }
  }

  checkRhodeIslandDriverLicenseFormat() {
    let regex = /^\d{7}$|^[A-Za-z]\d{6}$/;
    if (regex.test(this.driverLicense)) {
      return {
        status: 'success',
        message: 'Valid Rhode Island Driver License Form'
      }
    }
    return {
      status: 'error',
      message: 'Driver License must be Rhode Island Driver License Form'
    }
  }

  checkAddressDealerShip() {
    if (this.dealerShipType === DealerShipType.RI) {
      const dealerShipAddressOptions = auto_ri_address.map(item => item.label);
      if (dealerShipAddressOptions.includes(this.dealerShipAddress)) {
        return {
          status: 'success',
          message: 'Valid Dealership Address'
        }
      }
      return {
        status: 'error',
        message: 'The program does not support this Dealership Address'
      }

    }
    else {
      const dealerShipAddressOptions = auto_out_of_state_address.map(item => item.label);
      if (dealerShipAddressOptions.includes(this.dealerShipAddress)) {
        return {
          status: 'success',
          message: 'Valid Dealership Address'
        }
      } 
      return {
        status: 'error',
        message: 'The program does not support this Dealership Address'
      }
    }
  }

  getPurchaseRebateAmount() {
    switch (this.evType) {
      case 'BEV':
      case 'FCEV':
        return REBATE.PURCHASE_AMOUNT_BEV_FCEV;
      case 'PHEV':
        return REBATE.PURCHASE_AMOUNT_PHEV;
      default: return 0;
    }
  }

  getLeaseRebaseAmount() {
    switch (this.evType) {
      case 'BEV':
      case 'FCEV':
        return REBATE.LEASE_AMOUNT_BEV_FCEV;
      case 'PHEV':
        return REBATE.LEASE_AMOUNT_PHEV;
      default: return 0;
    }
  }

  getRebateAmount() {
    const dateResponsse = this.checkValidPurchaseOrLeaseDate();
    const driverLicenseResponse = this.checkRhodeIslandDriverLicenseFormat();
    const leaseTermResponse = this.checkLeaseTermLongEnough();
    const dealerShipResponse = this.checkAddressDealerShip();
    const responses = [dateResponsse, driverLicenseResponse, leaseTermResponse, dealerShipResponse];
    const errorResponses = responses.filter(response => response.status === 'error');

    if (errorResponses.length === 0) {
      if (this.programType === ProgramType.Purchase) {
        return {
          status: 'success',
          message: 'Congratulation, you are eligible to receive discounts from the DriverEV !',
          discount: this.getPurchaseRebateAmount(),
          currency: 'USD'
        } 
      }
      else {
        return {
          status: 'success',
          message: 'Congratulation, you are eligible to receive discounts from the DriverEV !',
          discount: this.getLeaseRebaseAmount(),
          currency: 'USD'
        } 
      }
    } else {
      return {
        message: 'You are not eligible to receive discounts from the program',
        discount: 0,
        errors: errorResponses.map(item => item.message),
        status: 'error',
      }
    }
  }
}