import { SettingModel } from "../Transactions/setting-model";

export class AllCountsModel {
  public AllUsers: number = 0;
  public AllBranches: number = 0;
  public AllProduct: number = 0;
  public AllOrderPayTypes: number = 0;
  public AllOrderTypes: number = 0;
  public Settings? : SettingModel;  
  LoginByPin? :boolean; 
}
