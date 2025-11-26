import { ProductModel } from "src/app/core/Models/Transactions/product-model";
import { NetworkPrinterDropDownModel } from "./network-printer-drop-down-model";
import { OrderTypeDropDownModel } from "./OrderTypeDropDownModel";
import { PrinterDropDownModel } from "./PrinterDropDownModel";
import { PrintingOrderTypeModel } from "./PrintingOrderTypeModel";
import { PrintingProductGroupModel } from "./PrintingProductGroupModel";
import { PrintingProductModel } from "./PrintingProductModel";
import { ProductGroupModel } from "./product-group-model";
import { ProductDropDownModel } from "./ProductDropDownModel";
import { ProductGroupDropDownModel } from "./ProductGroupDropDownModel";
import { ProductTypeDropDownModel } from "./ProductTypeDropDownModel";

export class PrinterModel {
  public DocumentId: string;
  public Id: number;
  public Name: string;
  public VirtualName: string;
  public Type: number;
  public Count: number;
  public BranchId: number;
  public KDSOrderTypeList:string[];
  public IsDeleted: boolean;
  public IsSync: boolean;
  public IsChief: boolean;
  public IsSelected: boolean;
  public ChiefPassword: string;
  public NetworkPrinterDropDownModels: NetworkPrinterDropDownModel[];
  public OrderTypeDropDownModels: OrderTypeDropDownModel[];
  public ProductDropDownModels: ProductDropDownModel[];
  public ProductGroupDropDownModels: ProductGroupDropDownModel[];
  public ProductTypeDropDownModels: ProductTypeDropDownModel[];
  public PrinterDropDownModels: PrinterDropDownModel[];
  public PrintingOrderTypeModels: PrintingOrderTypeModel[];
  public PrintingProductModels: PrintingProductModel[];
  public PrinterProductGroups: PrintingProductGroupModel[];
  public ProductGroupModels: ProductGroupModel[];
  public ReportName: string[];
}
