import express from 'express';
import bodyParser from 'body-parser';
import { findSimilarProperties, loadDataSet, processPropertyData } from './loadAndRefineDataFunctions';
import { getEstimatedValue, rankProperties } from './openAi';

const app = express();
const PORT = 3000;

loadDataSet().then(() => {
  console.log('Data loaded');
}).catch((error) => {
  console.error('Error loading data:', error);
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the property valuation tool');
});

app.use(express.urlencoded({ extended: true }));

app.get('/form', (req, res) => {
  res.send(`
    <form action="/estimate" method="post">
      <label for="location">City:</label>
      <input type="text" id="city" name="city"><br><br>
      <label for="state">State:</label>
      <input type="text" id="state" name="state"><br><br>
      <label for="size">Size (sq ft):</label>
      <input type="text" id="size" name="size"><br><br>
      <label for="rooms">Number of rooms:</label>
      <input type="text" id="rooms" name="rooms"><br><br>
      <label for="condition">Condition of property:</label>
      <input type="text" id="condition" name="condition"><br><br>
      <label for="bath">Number of baths:</label>
      <input type="text" id="bath" name="bath"><br><br>
      <label for="rooms">acreage:</label>
      <input type="text" id="acre_lot" name="acre_lot"><br><br>
      <button type="submit">Estimate Value</button>
    </form>
  `);
});

app.post('/estimate', async (req, res) => {
const feature = req.body;
const { city, state } = feature;
 // Get similar properties from the dataset
const getSimilarProperties = await findSimilarProperties(city, state);
// Process the property data to top 5 similar properties
const processedData = processPropertyData(getSimilarProperties);
// ranking similar properties
const rankedProperties = await rankProperties(processedData, feature);
 // Estimate property value using OpenAI
const similarProperties = rankedProperties.length === 0 ? processedData : rankedProperties;
const estimatedValue = await getEstimatedValue(feature, similarProperties);

  res.send({
    estimatedValue,
    similarProperties
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});