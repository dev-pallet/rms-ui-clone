import { useLocation } from 'react-router-dom';

const NewPage = () => {
  const location = useLocation();
  const { requestBody } = location.state || {};

  // Rest of the component

  return (
    <div>
      <h2>Saved Data</h2>
      <pre>{JSON.stringify(requestBody, null, 2)}</pre>
    </div>
  );
};

export default NewPage;
