import { CustomerDropDownModel } from "./customer-drop-down-model";
import { DynamicCombo } from "./dynamic-combo";

export class CashReceiptModel {
  public DocumentId: string;
  public Id: number;
  public Date: Date;
  public Amount: string;
  public Description: string;
  public CustomerId: number;
  public CustomerName: string;
  public WorkTimeId: number;
  public Posted: boolean;
  public PostedACC: boolean;
  public Serial: string;
  public Count: number;
  public BranchId: number;
  public IsDeleted: boolean;
  public IsSync: boolean;
  public PayTypeDocumentId: string;
  public CustomerDropDownModels: CustomerDropDownModel[];
  public CustomerList: DynamicCombo[];
}
