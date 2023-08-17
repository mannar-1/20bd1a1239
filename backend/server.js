
// const express = require('express');
// const axios = require('axios');
// const url = require('url');

// const app = express();
// const PORT = 8008;

// app.get('/numbers', async (req, res) => {
//   const urls = req.query.url;
//   console.log("erwe",req.query);

//   if (!urls) {
//     return res.status(400).json({ error: 'Missing url query parameter' });
//   }


//   const parsedUrl = url.parse(urls, true);
//   console.log(parsedUrl)
//   const urlArray = Array.isArray(urls) ? urls : [urls];
//   console.log(urlArray)
// console.log(urlArray);

//   const numberPromises = urlArray.map(async (url) => {
//     try {
//       const response = await axios.get(url, { timeout: 500 });
//       const numbers = response.data.numbers || [];
//       return numbers.map((num) => parseInt(num, 10)); // Ensure numbers are parsed as integers
//     } catch (error) {
//       return [];
//     }
//   });

//   const allNumbers = await Promise.all(numberPromises);

//   const mergedNumbers = allNumbers.flat();

//   const uniqueSortedNumbers = [...new Set(mergedNumbers)].sort((a, b) => a - b);

//   res.json({ numbers: uniqueSortedNumbers });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  const urlArray = Array.isArray(urls) ? urls : urls.split('&url=');
  const additionalUrl = req.query[' url'];

  if (additionalUrl) {
    urlArray.push(additionalUrl);
  }

  const pattern = /\/numbers\/(primes|fibo|odd)/; // Add more patterns if needed

  const relevantUrls = urlArray.filter((url) => pattern.test(url));

  const numberPromises = relevantUrls.map(async (url) => {
    try {
      const response = await axios.get(url, { timeout: 500 });
      const numbers = response.data.numbers || [];
      return numbers.map((num) => parseInt(num, 10));
    } catch (error) {
      return [];
    }
  });

  const allNumbers = await Promise.all(numberPromises);

  const mergedNumbers = allNumbers.reduce((accumulator, currentNumbers) => {
    return accumulator.concat(currentNumbers);
  }, []);

  const uniqueSortedNumbers = [...new Set(mergedNumbers)].sort((a, b) => a - b);

  res.json({ numbers: uniqueSortedNumbers });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
