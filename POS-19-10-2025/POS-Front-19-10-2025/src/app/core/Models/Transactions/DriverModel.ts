import { EmployeeDropDownModel } from "./employee-drop-down-model";
import { DynamicCombo } from "./dynamic-combo";

export class DriverModel {
  public DocumentId: string;
  public Id: number;
  public TelephoneNumber: string;
  public Stopped: boolean;
  public isOut: boolean;
  public MaxOrders: number;
  public EmployeeId: number;
  public DriverName: string;
  public IsSync: boolean;
  public EmployeeDropDownModels: EmployeeDropDownModel;
  public EmpsList: DynamicCombo[];
  public IsSelected: boolean;
  public IncludedInTotal: boolean;
  public NotIncludedInTotal: boolean;
  public FixedDeliveryPersonAmount: boolean;
  public DriverFixedAmount: number;
}
