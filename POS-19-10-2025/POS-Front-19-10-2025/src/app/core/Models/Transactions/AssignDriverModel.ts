import { DriverModel } from "src/app/core/Models/Transactions/DriverModel";
import { OrderModel } from "src/app/core/Models/order/orderModel";
import { NetworkPrinterDropDownModel } from "./network-printer-drop-down-model";
export class AssignDriverModel {
  public OrderModels: OrderModel[];
  public DriverModels: DriverModel[];
  public NetworkPrinterDropDownModels: NetworkPrinterDropDownModel[];
}
