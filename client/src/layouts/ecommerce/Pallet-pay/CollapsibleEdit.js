import { Box } from '@mui/material';
import CollapseInput from './CollapseInput';



const CollapsibleEdit = ({ data, title, handleToggle, isExpanded, currentHeight, handleEditRate }) => {

  return (
    <Box
      className={`list-group-item ${isExpanded ? 'is-expanded' : ''}`}
      //   onClick={handleToggle}
      sx={{
        marginTop: '1rem',
      }}
    >
      <Box className="card-title">
        <h5 className="card-title-text">{title}</h5>
      </Box>
      <Box className="card-collapse" style={{ height: `${currentHeight}px`, zIndex: '22224' }}>
        <Box
          className="card-body"
          //   ref={ref}
        >
          <Box className="debit-card-list">
            {data.length && data.map((item, index) => <CollapseInput data={item} title={title} handleEditRate={handleEditRate} key={index} index={index}/>)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CollapsibleEdit;
