import NewlocationRETAIL from './retail';
import NewlocationWMS from '.';
import React from 'react';

const MapperNewLoc = () => {

  const contextType = localStorage.getItem('contextType');

  return (
    <div>
      {contextType === 'WMS'
        ?<NewlocationWMS />
        : contextType === 'RETAIL'
          ?<NewlocationRETAIL />
          :null
      }
    </div>
  );
};

export default MapperNewLoc;
