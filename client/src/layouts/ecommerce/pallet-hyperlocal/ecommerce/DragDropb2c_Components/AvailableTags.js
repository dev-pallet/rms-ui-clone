import { Card } from '@mui/material';
import { dateFormatter, textFormatter } from '../../../Common/CommonFunction';
import { tagFilterdata } from '../../../../../config/Services';
import DisplayTags from '../../../market-place/DisplayTags';
import React, { useEffect, useState } from 'react';

const AvailableTags = ({ typeId }) => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [tagRowData, settagRowData] = useState([]);
  useEffect(() => {
    const payload = {
      page: '1',
      pageSize: '100',

      orgIds: [orgId],
      locationIds: [locId],

      tagIds: [typeId],
      sort: {
        creationDateSortOption: 'DESC',
        tagPriority: 'DEFAULT',
      },
    };
    tagFilterdata(payload)
      .then((res) => {
        const data = res.data?.data.data.data?.map((e, i) => ({
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
    <div>
      <Card>
        <DisplayTags
          newSalesCart={{}}
          editGtin={tagRowData[0]?.gtins}
          tagName={tagRowData[0]?.TagName}
          mobileView={true}
        />
      </Card>
    </div>
  );
};

export default AvailableTags;
