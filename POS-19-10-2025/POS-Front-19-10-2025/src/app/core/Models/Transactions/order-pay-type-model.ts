// export enum CarryCommissionOn{
//   Company ,
//   Customer
// }
export class OrderPayTypeModel {
  public DocumentId: string;
  public Id: number;
  public Name: string;
  public ForeignName: string;
  public PayType: number;
  public Percentage: number;
  public BankId: number;
  public CompanyId: number;
  public IsStopped: boolean;
  public NoteIsRequired: boolean;
  // HasCommission : boolean;
  // CommissionAmount : number;
  // CarryCommissionOn: CarryCommissionOn ;
}
