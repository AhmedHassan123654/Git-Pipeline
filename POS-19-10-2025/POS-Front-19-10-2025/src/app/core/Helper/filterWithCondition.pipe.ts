import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterWithCondition"
})
export class FilterWithConditionPipe implements PipeTransform {
  transform(objectList: any[], condition: any): any {
    if (!objectList || !condition) {
      return objectList;
    }
    let result = objectList.filter(condition);
    if (result && result.length > 0) return result;
    else return objectList;
  }
}
