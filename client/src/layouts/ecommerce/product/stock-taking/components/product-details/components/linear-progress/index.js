import './index.css';
const CustomLinearProgressBar = ({ percentage }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <progress
        value={percentage}
        max="100"
        style={{ width: '100%', height: '25px' }}
        className={percentage == 100 ? 'green' : 'blue'}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '37%',
          transform: 'translate(-50%, -50%)',
          fontSize: '10px',
          color: percentage == 100 ? 'white' : 'black',
          fontWeight: 'bold',
        }}
      >
        {percentage == 100 ? 'completed' : `${percentage}% completed`}
      </div>
    </div>
  );
};

export default CustomLinearProgressBar;
