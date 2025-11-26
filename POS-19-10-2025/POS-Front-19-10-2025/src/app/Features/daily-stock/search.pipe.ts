import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "search"
})
export class SearchPipe implements PipeTransform {
  transform(searchArray: any[], term: string, param: string = "Name"): object[] {
    let searchResult: any;
    if (term) {
      searchResult = searchArray.filter((item) => item[param].toLowerCase().includes(term.toLowerCase()));
      return searchResult;
    } else {
      return searchArray;
    }
  }
}
