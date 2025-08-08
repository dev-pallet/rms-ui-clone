import { Paper } from '@mui/material';
import { dateFormatter, textFormatter } from '../../../Common/CommonFunction';
import { tagFilterdata } from '../../../../../config/Services';
import DisplayTags from '../../../market-place/DisplayTags';
import React, { useEffect, useState } from 'react';

const SelectAvailableTags = ({contentTypeId , setContentTypeId}) => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [tagRowData, settagRowData] = useState([]);
  useEffect(() => {
    const payload = {
      page: '1',
      pageSize: '100',

      orgIds: [orgId],
      locationIds: [locId],

      sort: {
        creationDateSortOption: 'DESC',
        tagPriority: 'DEFAULT',
      },
    };
    tagFilterdata(payload)
      .then((res) => {
        const data = res?.data?.data?.data?.data?.map((e, i) => ({
          id: e?.tagId,
          TagName: textFormatter(e?.tagName),
          Tags: e?.tags[0]?.split('_')?.pop(),
          gtins: e?.gtins,
          Createdat: e?.createdAt ? dateFormatter(e?.createdAt) : 'NA',
          Status: e?.status || 'ACTIVE',
          buttons: '',
        }));
        settagRowData(data);
      })
      .catch((err) => {});
  }, []);
  return (
    <div style={{padding:'10px'}}>
      {tagRowData?.map((item) => (
        <Paper>
          <DisplayTags
            newSalesCart={{}}
            tagId = {item?.id}
            editGtin={item?.gtins}
            tagName={item?.TagName}
            selectionView={true}
            setContentTypeId={setContentTypeId}
            contentTypeId={contentTypeId}
            //   mobileView={true}
          />
        </Paper>
      ))}
    </div>
  );
};

export default SelectAvailableTags;
