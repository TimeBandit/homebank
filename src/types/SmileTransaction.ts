import { SmilePaymentType } from "./SmilePaymentType";
export interface SmileTransaction {
  Date: string;
  Description: string;
  Type: SmilePaymentType;
  ["Money In"]: string;
  [" Money Out"]: string;
  ["Balance"]: string;
}
