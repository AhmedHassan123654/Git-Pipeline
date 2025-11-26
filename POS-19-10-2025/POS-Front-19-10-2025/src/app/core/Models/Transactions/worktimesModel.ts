import { WorkTimeCachiersModel } from "./work-time-cachiersModel";
import { WorkTimeDaysModel } from "./work-time-daysModel";

export class WorktimesModel {
  public DocumentId: string;
  public Name: string;
  public ForiegnName: string;
  public ExitSystemWhenShiftEnd: boolean;
  public ISActive: boolean;
  public AlertBeforeEnd: number;
  public Count: number;
  public WorkTimeDays: Array<WorkTimeDaysModel>;
  public WorkTimeCachiers: Array<WorkTimeCachiersModel>;
}
