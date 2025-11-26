export class EmployeeModel {
  public DocumentId: string;
  public FirstName: string;
  public SecondName: string;
  public FullName: string;

  public LastName: string;
  public Phone: string;
  public PictureName: string;
  public GroupId: number;
  public BirthDate: Date;

  public HireDate: Date;
  public Address: string;
  public CityId: number;
  public RegionId: number;
  public UserId: number;
  public NationalityId: number;

  public ShouldHaveMeal: boolean;
  public HrOrganizationStructureId: number;
  public WorkHours: number;
  public StartWorkDate: Date;

  public UsersType: number;
  public AccountId: number;
  public StaffProductId: number;
  public HrJobId: number;
  public HrJobTypeId: number;
  public HrLevelId: number;
  public HrDegreeId: number;
  public HrJobCategoryId: number;
  public HrContractTypeId: number;
  public NumberFingerprint: number;

  public InActive: boolean;
  public InActiveDate: Date;
  public InActiveReason: string;

  public BranchId: number;
}
