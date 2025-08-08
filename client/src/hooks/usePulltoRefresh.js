import { useState } from 'react';
import Spinner from '../components/Spinner';

function usePullToRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startY, setStartY] = useState(null);
  const [loaderDependency , setLoaderDependency] = useState(false)
  const handleTouchStart = (e) => {
    if (isRefreshing) return;
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (isRefreshing) return;
    let currentY = e.touches[0].clientY;
    let distance = currentY - startY;

    if (distance > 0 && window.scrollY === 0) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (isRefreshing) return;
    let distance = e.changedTouches[0].clientY - startY;
    if (distance > 100) {
      setLoaderDependency(!loaderDependency)
      setIsRefreshing(true);
      setIsLoading(true);
      setTimeout(() => {
        setIsRefreshing(false);
        setIsLoading(false);
      }, 2000); 
    }
  };

  const loadingIndicator = isLoading ? (
    <center
    style={{
      padding: "15px"
    }}
  >
        <Spinner size={'1.3rem'} />
    </center>
) : (
    null
);

  return { isRefreshing, isLoading, loadingIndicator, handleTouchStart, handleTouchMove, handleTouchEnd  , loaderDependency};
}

export default usePullToRefresh;
