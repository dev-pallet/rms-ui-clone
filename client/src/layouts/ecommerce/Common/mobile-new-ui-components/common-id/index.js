import './common-id.css';

const CommonId = ({ text, id }) => {
  const formatId = (str) => {
    if (str) {
      if (str.includes('_')) {
        return (
          str
            // .toLowerCase()
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        );
      } else {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
    }
  };
  return (
    <div className="id-number-div">
      <span className="id-number">
        {text} {formatId(id)}
      </span>
    </div>
  );
};

export default CommonId;
