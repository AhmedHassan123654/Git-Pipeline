import { RegionModel } from "./RegionModel";

export class CustomerAddressModel {
  public ReferenceCode: string;
  public Id: number;
  public DocumentId: string;
  public CustomerId: number;
  public CustomerDocumentId: string;
  public Zone: string;
  public Floor: string;
  public Apartment: string;
  public BuildingNumber: string;
  public StreetNumber: string;
  public Description: string;
  public Longitude: string;
  public Latitude: string;
  public RegistedByApp: boolean;
  public IsDefault: boolean;
  public IsSelected: boolean;
  public RegionId: number;
  public RegionName: string;
  public Serial: string;
  public GpsLocation: string;
  public Region: RegionModel;
}
