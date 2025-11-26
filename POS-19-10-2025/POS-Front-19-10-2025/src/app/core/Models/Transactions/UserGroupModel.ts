import { UsersModel } from "./UsersModel";

export class UserGroupModel {
  public Name: string;
  public ForeignName: string;
  public Users: Array<UsersModel>;
  public UsersList: Array<UsersModel>;
}
