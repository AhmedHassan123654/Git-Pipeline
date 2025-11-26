export enum quickMode {
  queryMode = 1,
  newMode = 2,
  modifyMode = 3
}

export enum quickAction {
  query = 1,
  beforeNew = 2,
  beforeModify = 3,
  beforeAdd = 4,
  beforeUpdate = 5,
  beforeDelete = 6,
  beforeUndo = 7,
  afterNew = 8,
  afterModify = 9,
  afterAdd = 10,
  afterUpdate = 13,
  afterDelete = 14,
  afterUndo = 15,
  gridAfterEdit = 16
}

export enum PayTypes {
  Cash = 1,
  Credit = 2,
  Visa = 3
}
