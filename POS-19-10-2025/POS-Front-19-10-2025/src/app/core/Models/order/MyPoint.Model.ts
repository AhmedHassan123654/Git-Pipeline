import { MyPointDetailModel } from "./MyPointDetail.Model";

export class MyPointModel {
    public Description: string;
    public PointValue: number;
    public AmountToPoint: number;
    public ExpireDayNum: number;
    public MyPointDetails: MyPointDetailModel[];
  }