import { HomebankPaymentType } from "./HomebankPaymentType";
export interface HombankTransaction {
  date: string;
  payment: HomebankPaymentType;
  info: string;
  payee: string;
  memo: string;
  amount: number;
  category: string;
  tags: string;
}
