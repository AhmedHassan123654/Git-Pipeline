import { ExtraExpenseTypes } from "./ExtraExpenseType-Drop-Down-Model";
import { DynamicCombo } from "./dynamic-combo";

export class ExtraExpensesModel {
  public DocumentId: string;
  public Id: number;
  public Amount: string;
  public Description: string;
  public ExtraExpensesTypeId: number;
  public Posted: boolean;
  public PostedACC: boolean;
  public Serial: string;
  public Date: Date;
  public BranchId: number;
  public IsDeleted: boolean;
  public IsSync: boolean;
  public PayTypeDocumentId: string;
  public ExtraExpensesType: ExtraExpenseTypes;
  public ExtraExpenseTypes: ExtraExpenseTypes[];
  public ExtraExpenseTypesList: DynamicCombo[];
}
