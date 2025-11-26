export class MenuItem {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public image: MenuItemImage,
    public discount: number,
    public ratingsCount: number,
    public ratingsValue: number,
    public availibilityCount: number,
    public cartCount: number,
    public weight: number,
    public isVegetarian: boolean,
    public categoryId: number
  ) {}
}
export class MenuItemImage {
  constructor(public small: string, public medium: string, public big: string) {}
}
export class Category {
  constructor(public id: number, public name: string, public description: string) {}
}
export class Order {
  constructor(
    public id: number,
    public date: string,
    public items: MenuItem[],
    public quantity: number,
    public amount: number,
    public status: any
  ) {}
}
export class Pagination {
  constructor(
    public page: number,
    public perPage: number,
    public prePage: number | null,
    public nextPage: number | null,
    public total: number,
    public totalPages: number
  ) {}
}
