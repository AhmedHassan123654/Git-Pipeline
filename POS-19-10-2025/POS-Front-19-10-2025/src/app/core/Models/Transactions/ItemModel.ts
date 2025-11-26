import { ItemUnitModel } from "./ItemUnitModel";

export class ItemModel {
  public Id: number;
  public Name: string;
  public GroupId: number;
  public IsSemiItem: boolean;
  public IsConsumer: boolean;
  public IsGeneral: boolean;
  public GItemId: number;
  public POSItemUnits: ItemUnitModel[];
}
