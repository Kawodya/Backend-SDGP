

const handleError = (error) => {
    console.error("Error:", error);
    throw new Error(`Error: ${error.message}`);
  };
  
  