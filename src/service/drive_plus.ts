import IncomeQualifiedProgram from './incomequalified';
import { CheckValidUserData } from './common';

export class DrivePlusRebate extends CheckValidUserData {
  private householdSize: number;
  private incomeQualifiedProgram = new IncomeQualifiedProgram();
  private supportingDocumentsSubmitted: boolean;
  constructor(purchaseDate: Date, householdSize: number, agreedValue?: number) {
    super(purchaseDate, agreedValue);
    this.householdSize = householdSize;
    this.supportingDocumentsSubmitted = false;
  }

  qualifyForDrivePlusRebate(income: number, dealership: string): boolean {
    return (
      this.isRhodeIslandResident() &&
      this.isLicensedDealership(dealership) &&
      this.purchaseDate &&
      this.incomeQualifiedProgram.isIncomeQualified(this.householdSize, income) &&
      !this.supportingDocumentsSubmitted
    );
  }

  submitSupportingDocuments(): void {
    // Logic to submit supporting documents
    // Set supportingDocumentsSubmitted to true
    this.supportingDocumentsSubmitted = true;
  }
}

// Example usage:
// const drivePlusRebate = new DrivePlusRebate(new Date(), 15000, 1);
// drivePlusRebate.qualifyForDrivePlusRebate(30000, 'McGovern Chevrolet');
