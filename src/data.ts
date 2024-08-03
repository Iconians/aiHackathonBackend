import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

const data: any[] = []; // Array to store the data from the CSV file

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
  const location = `${city} ${state}`;
  console.log(data.filter((property) => property.city === location))
  return data.filter((property) => property.city === city && property.state === state);
}