import { CategoryDetailModel } from "./CategoryDetailModel";
import { PayTypeDetailModel } from "./pay-type-detail-model";
import { WorktimesModel } from "./worktimesModel";

export class IncomingUserModel {
  /**
   *
   */
  constructor() {
    this.CategoryDetails = [];
  }
  public DocumentId: string;
  public Id: number;
  public CreationTime: string;
  public CreatorUserId: number;
  public UserId: number;
  public UserName: string;
  public SalesAmount: number;
  public ExpensesAmount: number;
  public CreditAmount: number;
  public VisaAmount: number;
  public CashType: string;
  public Amount: number;
  public CreditDescription: string;
  public VisaDescription: string;
  public TaxAmount: number;
  public InsuranceAmount: number;
  public OpenBalance: number;
  public EndDay: Date;
  public EndDayMaping: string;
  public Approved: boolean;
  public Closed: boolean;
  public PointOfSaleId: number;
  public NetAmount: number;
  public DeficitOrIncreaseAmount: number;
  public ReceivedUserId: number;
  public BranchId: number;
  public IsDeleted: boolean;
  public IsSync: boolean;
  public ReceivedUserPin: any;
  public WorkTimeId: number;
  public WorkTimeDocumentId: string;
  public WorkTimeName: string;
  public CategoryDetails: CategoryDetailModel[];
  public Detials: String;
  public PointOfSaleDocumentId: String;
  public PointOfSaleName: String;
  public show: boolean;
  public WorkTime: WorktimesModel;
  public PaymentDetail: PayTypeDetailModel[];
  public OpenShiftUserId: string;
  public LanguageOptions: any;
}
