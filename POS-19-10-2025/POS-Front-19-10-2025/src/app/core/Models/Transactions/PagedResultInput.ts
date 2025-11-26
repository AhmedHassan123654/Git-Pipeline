export class PagedResultInput {
  public Page: number = 1;
  public SearchQuery: string;
  public Sort: string;
  public IsDesc: boolean;
  //System.Web.UI.Page
  public ItemsPerPage: number = 10;
}
