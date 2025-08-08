const SkeletonLoader = ({ type }) => {
  const counts = {
    board: 5,
    'order-details': 10,
    'single-item': 1,
  };

  const skeletonClass = {
    board: 'skeleton-board-item',
    'order-details': 'skeleton-order-item',
    'single-item': 'skeleton-single-item',
  };

  return (
    <div className="skeleton-loader">
      {Array.from({ length: counts[type] }).map((_, index) => (
        <div key={index} className={skeletonClass[type]}></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
