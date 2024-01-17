export default class IncomeQualifiedProgram {
  private householdIncomeLimits: Record<number, { twelveMonths: number; threeMonths: number; oneMonth: number }>;

  constructor() {
    // Define income limits for different household sizes
    this.householdIncomeLimits = {
      1: { twelveMonths: 34039, threeMonths: 8510, oneMonth: 2837 },
      2: { twelveMonths: 44039, threeMonths: 10510, oneMonth: 3837 },
      // Add more entries for other household sizes
      // ...
    };
  }

  isIncomeQualified(householdSize: number, income: number): boolean {
    const limits = this.householdIncomeLimits[householdSize];
    if (limits) {
      return income <= limits.twelveMonths;
    }
    return false;
  }
}
