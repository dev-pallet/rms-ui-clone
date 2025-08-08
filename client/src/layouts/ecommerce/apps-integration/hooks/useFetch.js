import {useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';

export const dataExtractor = data => {
  if (data) {
    if (data?.data) {
      return data?.data;
    }
    return data?.data;
  }
  return data?.data;
};

const useFetch = ({
  name = '',
  service,
  conditionalRefetch,
  id,
  props = {},
  params = {},
  dataOnly,
  condition = true,
  onSuccess,
  target,
}) => {
  let {isLoading, refetch, data, error, isSuccess, isRefetching} = useQuery(
    [name, conditionalRefetch],
    () => service({id, params, ...props}),
    {enabled: condition},
    
  );

  useEffect(() => {
    if (isSuccess && onSuccess) {onSuccess(data);}
    //  console.info(`hook called: ${name}`);
  }, [isSuccess]);

  if (dataOnly) {return data;}

  data = dataExtractor(data);

  return {
    isLoading,
    refetch,
    data,
    error,
    isSuccess,
    isRefetching,
  };
};

export default useFetch;