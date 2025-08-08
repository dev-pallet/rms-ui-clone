import './progressbar.css';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import RadialSeparators from './seperator';

export const CircularProgress = () => {
  return (
    <CircularProgressbarWithChildren
      value={80}
      text={`${90}%`}
      strokeWidth={10}
      styles={buildStyles({
        strokeLinecap: 'butt',
      })}
    >
      <RadialSeparators
        count={12}
        style={{
          background: 'white',
          width: '2px',
          color: 'red',
          height: `${10}%`,
        }}
      />
    </CircularProgressbarWithChildren>
  );
};
