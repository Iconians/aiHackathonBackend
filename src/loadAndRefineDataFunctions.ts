import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

type propertyDataType = {
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

const data: propertyDataType[] = []; // Array to store the data from the CSV file

export const loadDataSet = async () => {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve(__dirname, '../datasets/realtor-data.zip.csv');
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        resolve(data);
      });
  });
}

export const findSimilarProperties = async (city: string, state: string) => {
  return data.filter((property) => property.city.toLowerCase() === city.toLowerCase() && property.state.toLowerCase() === state.toLowerCase());
}

export function processPropertyData(data: propertyDataType[]) {
  const sortData = data.sort((a, b) => parseInt(a.bed) - parseInt(b.bed));
  if (sortData.length < 5) return sortData;
  return sortData.slice(0, 5);
}