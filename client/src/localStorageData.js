import React from 'react';

const LocalStorageData = () => {
  // Get only existing key-value pairs from localStorage
  const localStorageItems = Object.keys(localStorage)?.map((key) => {
    return { key, value: localStorage.getItem(key) };
  });

  // Check if there are any items to display
  if (localStorageItems?.length === 0) {
    return <p>No items in local storage</p>;
  }

  return (
    <div style={{ maxWidth: '100%' }}>
      <h3>Local Storage Data</h3>
      <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Key</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {localStorageItems?.map((item, index) => (
            <tr key={index}>
              <td
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #ddd',
                  textAlign: 'left',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                }}
              >
                {item?.key}
              </td>
              <td
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #ddd',
                  textAlign: 'left',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                }}
              >
                {item?.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Keys Only</h4>
      <ul style={{ fontSize: '14px', padding: '0', listStyle: 'none', textAlign: 'left' }}>
        {localStorageItems?.map((item, index) => (
          <li key={index} style={{ padding: '4px 0' }}>
            {item?.key}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocalStorageData;
