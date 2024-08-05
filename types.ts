export type propertyDataType = {
  brokered_by: string,
  status: string,
  price: string,
  bed: string,
  bath: string,
  acre_lot: string,
  street: string,
  city: string,
  state: string,
  zip_code: string,
  house_size: string,
  prev_sold_date: string,
}

export type similarPropertyType = {
  property: propertyDataType,
  relevance_score: number,
}