import Papa from 'papaparse';

const fetchCsvData = async (url) => {
  try {
    const response = await fetch(url, {
      headers: {},
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response?.statusText}`);
    }

    const csv = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csv, {
        header: true,
        complete: (results) => {
          const data = results?.data || [];
          
          // Check if the data is empty
          const dataWithIds = data?.length > 0 
            ? data.map((row, index) => ({
              id: index + 1,
              ...row,
            }))
            : data; // Return the data as-is if empty

          resolve(dataWithIds);
        },
        error: (error) => reject(error),
      });
    });
  } catch (error) {
    throw error;
  }
};

export default fetchCsvData;
