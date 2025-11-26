import { CustomerAddressModel } from "./CustomerAddressModel";

export class CustomerModel {
  public ReferenceCode: string;
  public DocumentId: string;
  public Id: number;
  public Serial: string;
  public Name: string;
  public ForiegnName: string;
  public CustomerTypeId: number;
  public CustomerTypeName: string;
  public Phone: string;
  public Phone2: string;
  public Phone3: string;
  public Nationality: number;
  public Language: number;
  public ActivationCode: string;
  public RegisteredByApp: boolean;
  public Fax: string;
  public TaxNo: string;
  public UseTaxNumber: boolean;
  public UseCredit: boolean;
  public IsBlackListed: boolean;
  public Notes: string;
  public CustomerBarcode: string;
  public CustomerBalance: number;
  public DebtLimit: number;
  public Password: string;
  public AccountId: number;
  public InActive: boolean;
  public CompanyId: number;
  public isCollapse: boolean;
  public TypeOfCustomer: string;
  public IsSync: boolean;
  public Addresses: CustomerAddressModel[];
  public OneAddress: CustomerAddressModel;
  public CustomerGroupDocumentId: string;
  public CustomerPoints?: number;
  public IntegrationCommission?: number;
  public IntegrationCode?: string;

  //العنوان الوطني
  public Country :string;
  public PostalCode :string;
  public City :string;
  public SubNumber :string;
}
