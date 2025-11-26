import { Combo, ProductModel } from "../Models/Transactions/product-model";

export function getAllGroupMealsCombos(prductList:ProductModel[]): Combo[] {
    return (prductList as any)?.flatMap(product => product.Combos || [])
}
export function isAChildOfMealGroup(product:ProductModel, allCombos:Combo[]): boolean {
    return allCombos.some(c=>c.ComboProductDocumentId === product?.DocumentId || (product?.Id && c.ComboProductId === product?.Id));
}