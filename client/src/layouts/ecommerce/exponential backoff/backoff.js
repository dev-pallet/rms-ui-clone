const exponentialBackoff = async (apiCall, maxRetries = 3, initialDelay = 1000) => {
  let currentRetries = 0;
  let currentDelay = initialDelay;
  
  while (currentRetries < maxRetries) {
    try {
      const response = await apiCall();
      return response;
    } catch (error) {
      if (error.response?.data === 'Rate exceeded.' || error.code === 'ECONNRESET') {
        // Rate exceeded or Socket hang up error occurred
        if (currentRetries === maxRetries - 1) {
          throw error; // Throw the error after maxRetries are exhausted
        }
  
        await new Promise((resolve) => setTimeout(resolve, currentDelay)); // Wait for currentDelay before retrying
        currentRetries++;
        currentDelay *= 2; // Exponential backoff: double the delay for each retry
      } else {
        throw error; // Throw any other errors that occurred
      }
    }
  }
  
  throw new Error('Please Refresh the page'); // Throw an error if maxRetries are exhausted
};
  
export default exponentialBackoff;
  