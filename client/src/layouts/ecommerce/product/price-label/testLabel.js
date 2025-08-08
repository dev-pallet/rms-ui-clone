import {
  create100x50,
  create40x20,
  create40x20NFS,
  create40x20x3,
  create40x20x3Godex,
  create40x20x3zebra,
  create40x25,
  create50x25,
  create50x40,
  create50x50,
  create80x35,
} from './printUtils';
import { postPrnFile } from '../../../../config/Services';

const data = [
  {
    itemName: 'COIR MAT REGULAR 15*24',
    gtin: '5555500009855',
    weight: '50 kgs',
    packedDate: '2025-08-16',
    expirationDate: '2025-08-16',
    mrp: 100,
    lotNo: '123456789',
    packedBy: 'SKY CROP INDIA PVT LTD',
  },
];

async function handlePrint(data, type) {
  // const newData = data.flatMap((item) => { // for cloning items in the array with quantityUnits
  //   const clonedItems = [];
  //   for (let i = 0; i < item.quantityUnits; i++) {
  //     clonedItems.push({ ...item });
  //   }
  //   return clonedItems;
  // });
  // console.log(newData);
  const payload = {
    data: data,
    type: type,
  };
  const file = await generatePrn(payload);

  await uploadPrn(file);
}

const createContent = async (data, type) => {
  const retail = localStorage.getItem('data');
  const retailData = retail ? JSON.parse(localStorage.getItem('data')) : null;
  const fssaiNumber = retailData?.fssaiNumber || 'NA';

  switch (type) {
    case '40x20x3':
      return await create40x20x3(data);
    case '40x20x3zebra':
      return await create40x20x3zebra(data, fssaiNumber);
      case '40x20x3godex':
      return await create40x20x3Godex(data, fssaiNumber);
    case '80x35':
      return await create80x35(data);
    case '50x50':
      return await create50x50(data);
    case '50x40':
      return await create50x40(data);
    case '40x20':
      return await create40x20(data);
    case '40x25':
      return await create40x25(data);
    case '50x25':
      return await create50x25(data);
    case '40x20_nfs':
      return await create40x20NFS(data);
    case '100x50':
      return await create100x50(data);
    default:
      console.info('invalid label type');
      return null;
  }
};

const generatePrn = async ({ data, type }) => {
  const fileContent = await createContent(data, type);
  const prnBlob = new Blob([fileContent], { type: 'multipart/form-data' });
  return prnBlob;
};

const uploadPrn = async (file) => {
  const formData = new FormData();
  formData.append('multipartFile', file, 'output.prn');
  try {
    const response = await postPrnFile(formData);
  } catch (err) {}
};

export default handlePrint;
