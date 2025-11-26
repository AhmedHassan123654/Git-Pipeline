import { ItemTransferRequestDetailsModel } from "./ItemTransferRequestDetailsModel";
import { StockModel } from "../order/stockModel";
import { ItemGroupModel } from "./ItemGroupModel";
import { ItemModel } from "./ItemModel";
import { UnitModel } from "./UnitModel";

export class ItemTransferRequestModel {
  public DocumentId: string;
  public Id: number;

  public Description: string;

  public Posted: boolean;
  public PostedACC: boolean;
  public Serial: string;
  public Count: number;
  public BranchId: number;
  public IsDeleted: boolean;
  public IsSync: boolean;

  public DocumentNumber: number;
  public DocumentDate: Date;
  public StockId: number;
  public ToStockId: number;
  public Reference: string;
  public Process: boolean;
  public IsPeriodical: boolean;
  public SaveAs: number;
  public ItemTransferRequestDetails: ItemTransferRequestDetailsModel[];
  public ItemGroups: ItemGroupModel[];
  public POSItems: ItemModel[];
  public Stocks: StockModel[];
  public Units: UnitModel[];
}
