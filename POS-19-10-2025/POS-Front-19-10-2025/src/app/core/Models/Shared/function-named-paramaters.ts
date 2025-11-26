import { quickAction } from "src/app/shared/Imports/featureimports";

export interface fillFormParams {
  formObj: unknown;
}
export interface formPagingParams {
  formObj: unknown;
}

export interface afterNewParams {
  dateFields?: string[];
}

export interface beforeAddParams {
  comboLists?: string[];
  comboValues?: string[];
}

export interface countPagingParams {
  currentAction?: quickAction;
}

export interface preAddUpdateParams {
  subject?: any;
}
