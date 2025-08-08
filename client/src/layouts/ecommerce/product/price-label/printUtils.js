const locName = localStorage.getItem('locName');
const retailData = JSON.parse(localStorage.getItem('data'));
const fssaiNumber = retailData?.fssaiNumber || 'NA';

const setPosition = (item, initPosition = 200, threshold = 5) => {
  const itemLength = item.toString().length;
  if (itemLength < threshold) {
    return initPosition + (threshold - itemLength) * 30;
  } else if (itemLength > threshold) {
    return initPosition - (itemLength - threshold) * 30;
  } else {
    return initPosition;
  }
};

const checkPosition = (isSecondRow, shift = 390, initPosition) => {
  if (isSecondRow) {
    return initPosition - shift;
  } else {
    return initPosition;
  }
};

const compare = (a, b) => a === b;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-GB');
  return formattedDate;
};

const calculatePercentage = (mrp, sellingPrice) => {
  const percentage = ((mrp - sellingPrice) / mrp) * 100;
  return percentage.toFixed(0);
};

const create80x35 = async (data) => {
  let prnCode = `
SIZE 80.0 mm, 35 mm
DIRECTION 0,0
REFERENCE 0,0
OFFSET 0 mm
SET PEEL OFF
SET CUTTER OFF
SET PARTIAL_CUTTER OFF
SET TEAR ON`;

  data.map(({ itemName, mrp, sellingPrice, gtin }) => {
    prnCode += `
CLS
CODEPAGE 1252
TEXT 614,156,"ROMAN.TTF",180,1,12,"MRP"
TEXT 614,252,"ROMAN.TTF",180,1,11,"${itemName}"
TEXT 409,179,"ROMAN.TTF",180,1,23,"Rs.${mrp}"
DIAGONAL 420,110,${setPosition(mrp, 210, 3).toString()},184,4
TEXT 614,75,"ROMAN.TTF",180,1,12,"Selling Price"
TEXT 409,90,"ROMAN.TTF",180,1,23,"Rs.${sellingPrice}"`;

    if (gtin.length === 13) {
      prnCode += `
BARCODE 80,53,"EAN13",34,0,90,2,4,"${gtin}"
TEXT 40,61,"ROMAN.TTF",90,1,8,"${gtin[1]}"
TEXT 40,75,"ROMAN.TTF",90,1,8,"${gtin[2]}"
TEXT 40,89,"ROMAN.TTF",90,1,8,"${gtin[3]}"
TEXT 40,104,"ROMAN.TTF",90,1,8,"${gtin[4]}"
TEXT 40,117,"ROMAN.TTF",90,1,8,"${gtin[5]}"
TEXT 40,132,"ROMAN.TTF",90,1,8,"${gtin[6]}"
TEXT 40,153,"ROMAN.TTF",90,1,8,"${gtin[7]}"
TEXT 40,167,"ROMAN.TTF",90,1,8,"${gtin[8]}"
TEXT 40,181,"ROMAN.TTF",90,1,8,"${gtin[9]}"
TEXT 40,195,"ROMAN.TTF",90,1,8,"${gtin[10]}"
TEXT 40,210,"ROMAN.TTF",90,1,8,"${gtin[11]}"
TEXT 40,224,"ROMAN.TTF",90,1,8,"${gtin[12]}"
TEXT 40,35,"ROMAN.TTF",90,1,8,"${gtin[0]}"`;
    } else if (gtin.length === 8) {
      prnCode += `
BARCODE 80,53,"EAN8",34,0,90,2,4,"${gtin}"
TEXT 40,61,"ROMAN.TTF",90,1,8,"${gtin[0]}"
TEXT 40,76,"ROMAN.TTF",90,1,8,"${gtin[1]}"
TEXT 40,90,"ROMAN.TTF",90,1,8,"${gtin[2]}"
TEXT 40,104,"ROMAN.TTF",90,1,8,"${gtin[3]}"
TEXT 40,124,"ROMAN.TTF",90,1,8,"${gtin[4]}"
TEXT 40,139,"ROMAN.TTF",90,1,8,"${gtin[5]}"
TEXT 40,154,"ROMAN.TTF",90,1,8,"${gtin[6]}"
TEXT 40,168,"ROMAN.TTF",90,1,8,"${gtin[7]}"`;
    }

    prnCode += `
PRINT 1,1

`;
  });

  return prnCode;
};

const create100x50 = async (data) => {
  let prnCode = `
SIZE 99.10 mm, 50 mm
DIRECTION 0,0
REFERENCE 0,0
OFFSET 0 mm
SET PEEL OFF
SET CUTTER OFF
SET PARTIAL_CUTTER OFF
SET TEAR ON`;

  data?.map(({ itemName, mrp, sellingPrice }) => {
    const percentage = calculatePercentage(mrp, sellingPrice);

    prnCode += `
CLS
CODEPAGE 1252
TEXT 758,361,"ROMAN.TTF",180,1,16,"${itemName}"
BAR 484,34, 3, 244
TEXT 757,264,"ROMAN.TTF",180,1,46,"${percentage}%"
TEXT 757,122,"ROMAN.TTF",180,1,23,"OFF"
TEXT 447,238,"ROMAN.TTF",180,1,15,"MRP:"
TEXT 447,123,"ROMAN.TTF",180,1,14,"Our Price:"
TEXT 261,241,"ROMAN.TTF",180,1,17,"Rs.${mrp}"
TEXT 261,147,"ROMAN.TTF",180,1,32,"Rs.${sellingPrice}"
PRINT 1,1

`;
  });

  return prnCode;
};

const create50x50 = async (data) => {
  let prnCode = `
SIZE 97.5 mm, 50 mm
DIRECTION 0,0
REFERENCE 0,0
OFFSET 0 mm
SET PEEL OFF
SET CUTTER OFF
SET PARTIAL_CUTTER OFF
SET TEAR ON`;

  data?.map((item, index) => {
    if (index % 2 !== 0) {
      return null; // skip this iteration
    }
    const currentItem = item;
    const nextItem = data[index + 1];

    prnCode += `
CLS
CODEPAGE 1252`;

    if (currentItem?.gtin.length === 13) {
      prnCode += `
BARCODE 669,379,"EAN13",32,0,180,2,4,"${currentItem?.gtin}"
TEXT 661,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[1]}"
TEXT 647,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[2]}"
TEXT 633,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[3]}"
TEXT 618,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[4]}"
TEXT 604,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[5]}"
TEXT 590,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[6]}"
TEXT 569,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[7]}"
TEXT 555,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[8]}"
TEXT 541,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[9]}"
TEXT 527,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[10]}"
TEXT 512,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[11]}"
TEXT 498,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[12]}"
TEXT 687,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[0]}"`;
    } else if (currentItem?.gtin.length === 8) {
      prnCode += `
BARCODE 669,379,"EAN8",32,0,180,2,4,"${currentItem?.gtin}"
TEXT 661,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[0]}"
TEXT 647,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[1]}"
TEXT 632,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[2]}"
TEXT 618,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[3]}"
TEXT 597,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[4]}"
TEXT 583,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[5]}"
TEXT 568,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[6]}"
TEXT 554,344,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[7]}"`;
    } else {
      prnCode += '';
    }

    prnCode += `
TEXT 762,235,"ROMAN.TTF",180,1,10,"Price"
TEXT 762,176,"ROMAN.TTF",180,1,10,"Batch No"
TEXT 762,115,"ROMAN.TTF",180,1,10,"Packed On"
TEXT 762,55,"ROMAN.TTF",180,1,10,"Use By"
TEXT 762,292,"ROMAN.TTF",180,1,9,"${currentItem?.itemName.slice(0, 25)}"
TEXT 582,243,"ROMAN.TTF",180,1,16,"${currentItem?.mrp}"
TEXT 582,180,"ROMAN.TTF",180,1,12,"${currentItem?.batchNo}"
TEXT 574,119,"0",180,12,12,"${formatDate(currentItem?.inwardedOn)}"
TEXT 574,59,"ROMAN.TTF",180,1,12,"${formatDate(currentItem?.expirationDate)}"
BOX 410,77,582,128,3
BOX 410,17,582,68,3`;

    if (nextItem) {
      if (currentItem?.gtin.length === 13) {
        prnCode += `
BARCODE 279,379,"EAN13",32,0,180,2,4,"${nextItem?.gtin}"
TEXT 271,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[1]}"
TEXT 257,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[2]}"
TEXT 243,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[3]}"
TEXT 228,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[4]}"
TEXT 214,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[5]}"
TEXT 200,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[6]}"
TEXT 179,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[7]}"
TEXT 165,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[8]}"
TEXT 151,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[9]}"
TEXT 137,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[10]}"
TEXT 122,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[11]}"
TEXT 108,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[12]}"
TEXT 297,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[0]}"`;
      } else if (currentItem?.gtin.length === 8) {
        prnCode += `
BARCODE 279,379,"EAN8",32,0,180,2,4,"${nextItem?.gtin}"
TEXT 271,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[0]}"
TEXT 257,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[1]}"
TEXT 242,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[2]}"
TEXT 228,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[3]}"
TEXT 207,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[4]}"
TEXT 193,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[5]}"
TEXT 178,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[6]}"
TEXT 164,344,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[7]}"`;
      } else {
        prnCode += '';
      }
      prnCode += `
TEXT 372,235,"ROMAN.TTF",180,1,10,"Price"
TEXT 372,176,"ROMAN.TTF",180,1,10,"Batch No"
TEXT 372,115,"ROMAN.TTF",180,1,10,"Packed On"
TEXT 372,55,"ROMAN.TTF",180,1,10,"Use By"
TEXT 372,292,"ROMAN.TTF",180,1,9,"${nextItem?.itemName.slice(0, 25)}"
TEXT 192,243,"ROMAN.TTF",180,1,16,"${nextItem?.mrp}"
TEXT 192,180,"ROMAN.TTF",180,1,12,"${nextItem?.batchNo}"
TEXT 184,119,"0",180,12,12,"${formatDate(nextItem?.inwardedOn)}"
TEXT 184,59,"ROMAN.TTF",180,1,12,"${formatDate(nextItem?.expirationDate)}"
BOX 20,77,192,128,3
BOX 20,17,192,68,3`;
    }

    prnCode += `
PRINT 1,1

`;
  });

  return prnCode;
};

const create50x40 = async (data) => {
  let prnCode = `
SIZE 97.5 mm, 40 mm
DIRECTION 0,0
REFERENCE 0,0
OFFSET 0 mm
SET PEEL OFF
SET CUTTER OFF
SET PARTIAL_CUTTER OFF
SET TEAR ON`;

  data.map((item, index) => {
    if (index % 2 !== 0) {
      return null; // skip this iteration
    }
    const currentItem = item;
    const nextItem = data[index + 1];

    prnCode += `
    CLS
    CODEPAGE 1252`;

    if (currentItem?.gtin.length === 13) {
      prnCode += `
BARCODE 669,305,"EAN13",38,0,180,2,4,"${currentItem?.gtin}"
TEXT 661,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[1]}"
TEXT 647,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[2]}"
TEXT 633,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[3]}"
TEXT 618,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[4]}"
TEXT 604,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[5]}"
TEXT 590,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[6]}"
TEXT 569,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[7]}"
TEXT 555,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[8]}"
TEXT 541,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[9]}"
TEXT 527,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[10]}"
TEXT 512,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[11]}"
TEXT 498,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[12]}"
TEXT 687,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[0]}"`;
    } else if (currentItem?.gtin.length === 8) {
      prnCode += `
BARCODE 669,305,"EAN8",38,0,180,2,4,"${currentItem?.gtin}"
TEXT 661,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[0]}"
TEXT 647,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[1]}"
TEXT 632,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[2]}"
TEXT 618,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[3]}"
TEXT 597,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[4]}"
TEXT 583,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[5]}"
TEXT 568,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[6]}"
TEXT 554,264,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[7]}"`;
    } else {
      prnCode += '';
    }

    prnCode += `
TEXT 762,214,"ROMAN.TTF",180,1,9,"${currentItem?.itemName.slice(0, 25)}"
TEXT 762,136,"ROMAN.TTF",180,1,10,"Price"
TEXT 762,63,"ROMAN.TTF",180,1,10,"Batch No"
TEXT 582,149,"ROMAN.TTF",180,1,20,"${currentItem?.mrp}"
TEXT 582,66,"ROMAN.TTF",180,1,12,"${currentItem?.batchNo}"`;

    if (nextItem) {
      if (currentItem?.gtin.length === 13) {
        prnCode += `
BARCODE 279,305,"EAN13",38,0,180,2,4,"${nextItem?.gtin}"
TEXT 271,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[1]}"
TEXT 257,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[2]}"
TEXT 243,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[3]}"
TEXT 228,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[4]}"
TEXT 214,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[5]}"
TEXT 200,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[6]}"
TEXT 179,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[7]}"
TEXT 165,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[8]}"
TEXT 151,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[9]}"
TEXT 137,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[10]}"
TEXT 122,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[11]}"
TEXT 108,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[12]}"
TEXT 297,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[0]}"`;
      } else if (currentItem?.gtin.length === 8) {
        prnCode += `
BARCODE 279,305,"EAN8",38,0,180,2,4,"${nextItem?.gtin}"
TEXT 271,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[0]}"
TEXT 257,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[1]}"
TEXT 242,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[2]}"
TEXT 228,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[3]}"
TEXT 207,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[4]}"
TEXT 193,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[5]}"
TEXT 178,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[6]}"
TEXT 164,264,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[7]}"`;
      } else {
        prnCode += '';
      }
      prnCode += `
TEXT 372,214,"ROMAN.TTF",180,1,9,"${nextItem?.itemName.slice(0, 25)}"
TEXT 372,136,"ROMAN.TTF",180,1,10,"Price"
TEXT 372,63,"ROMAN.TTF",180,1,10,"Batch No"
TEXT 192,149,"ROMAN.TTF",180,1,20,"${nextItem?.mrp}"
TEXT 192,66,"ROMAN.TTF",180,1,12,"${nextItem?.batchNo}"`;
    }
    prnCode += `
PRINT 1,1

`;
  });

  return prnCode;
};

const create40x20 = async (data) => {
  let prnCode = `
SIZE 80 mm, 20 mm
DIRECTION 0,0
REFERENCE 0,0
OFFSET 0 mm
SET PEEL OFF
SET CUTTER OFF
SET PARTIAL_CUTTER OFF
SET TEAR ON`;

  data.map((item, index) => {
    if (index % 2 !== 0) {
      return null; // skip this iteration
    }
    const currentItem = item;
    const nextItem = data[index + 1];

    prnCode += `
CLS
CODEPAGE 1252`;

    if (currentItem?.gtin.length === 13) {
      prnCode += `
BARCODE 552,109,"EAN13",28,0,180,2,4,"${currentItem?.gtin}"
TEXT 544,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[1]}"
TEXT 530,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[2]}"
TEXT 516,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[3]}"
TEXT 501,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[4]}"
TEXT 487,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[5]}"
TEXT 473,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[6]}"
TEXT 453,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[7]}"
TEXT 439,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[8]}"
TEXT 425,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[9]}"
TEXT 411,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[10]}"
TEXT 395,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[11]}"
TEXT 381,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[12]}"
TEXT 570,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[0]}"`;
    } else if (currentItem?.gtin.length === 8) {
      prnCode += `
BARCODE 531,109,"EAN8",28,0,180,2,4,"${currentItem?.gtin}"
TEXT 523,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[0]}"
TEXT 509,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[1]}"
TEXT 494,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[2]}"
TEXT 480,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[3]}"
TEXT 459,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[4]}"
TEXT 445,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[5]}"
TEXT 430,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[6]}"
TEXT 416,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[7]}"`;
    } else {
      prnCode += '';
    }

    prnCode += `
TEXT 599,143,"ROMAN.TTF",180,1,8,"${currentItem?.itemName.slice(0, 25)}"
TEXT 554,42,"ROMAN.TTF",180,1,8,"Rs.${currentItem?.mrp}"
TEXT 477,41,"ROMAN.TTF",180,1,7,"Our Price"
TEXT 599,41,"ROMAN.TTF",180,1,7,"MRP"
TEXT 399,42,"ROMAN.TTF",180,1,8,"Rs.${currentItem?.sellingPrice}"`;

    if (nextItem) {
      if (currentItem?.gtin.length === 13) {
        prnCode += `
BARCODE 242,109,"EAN13",28,0,180,2,4,"${nextItem?.gtin}"
TEXT 234,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[1]}"
TEXT 220,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[2]}"
TEXT 206,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[3]}"
TEXT 191,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[4]}"
TEXT 177,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[5]}"
TEXT 163,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[6]}"
TEXT 143,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[7]}"
TEXT 129,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[8]}"
TEXT 115,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[9]}"
TEXT 101,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[10]}"
TEXT 85,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[11]}"
TEXT 71,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[12]}"
TEXT 260,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[0]}"`;
      } else if (currentItem?.gtin.length === 8) {
        prnCode += `
BARCODE 221,109,"EAN8",28,0,180,2,4,"${nextItem?.gtin}"
TEXT 213,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[0]}"
TEXT 199,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[1]}"
TEXT 184,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[2]}"
TEXT 170,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[3]}"
TEXT 149,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[4]}"
TEXT 135,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[5]}"
TEXT 120,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[6]}"
TEXT 106,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[7]}"`;
      } else {
        prnCode += '';
      }
      prnCode += `
TEXT 289,143,"ROMAN.TTF",180,1,8,"${nextItem?.itemName.slice(0, 25)}"
TEXT 244,42,"ROMAN.TTF",180,1,8,"Rs.${nextItem?.mrp}"
TEXT 167,41,"ROMAN.TTF",180,1,7,"Our Price"
TEXT 289,41,"ROMAN.TTF",180,1,7,"MRP"
TEXT 89,42,"ROMAN.TTF",180,1,8,"Rs.${nextItem?.sellingPrice}"`;
    }
    prnCode += `
PRINT 1,1

`;
  });

  return prnCode;
};

const create40x20x3Godex = async (data, fssaiNumber) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'NA';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  let ezpl = '';

  for (let i = 0; i < data.length; i += 3) {
    ezpl += `^Q20,2,0\r\n` + `^W105\r\n` + `^H20\r\n` + `^P1\r\n` + `^L\r\n`;

    const labels = [data[i], data[i + 1], data[i + 2]];
    const xOffsets = [14, 292, 574]; // ~105 mm total width (35 mm per label × 8 = 280 dots)

    for (let j = 0; j < labels.length; j++) {
      const item = labels[j];
      if (!item) continue;
      const x = xOffsets[j];

      ezpl +=
        `AB,${x + 14},0,1,1,0,0,${item?.itemName.slice(0, 18)}\r\n` +
        `AB,${x + 14},76,1,1,0,0,MRP:${item?.mrp} Our Price:${item?.sellingPrice}\r\n` +
        `BE,${x},36,2,3,40,0,0,${item?.gtin}\r\n` +
        `AA,${x + 14},106,1,1,0,0,PKD:${formatDate(item?.inwardedOn)}\r\n` +
        `AA,${x + 135},106,1,1,0,0,EXP:${formatDate(item?.expirationDate)}\r\n` +
        `AB,${x + 14},130,1,1,0,0,${fssaiNumber}\r\n`;
    }

    ezpl += `E\r\n`;
  }

  return ezpl;
};

const create40x20x3zebra = async (data, fssaiNumber) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'NA';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  let zplCode = `^XA
  ^PW1100
  ^LL600
  ^PR6
  ^CI28
  ^MD30`;

  for (let i = 0; i < data.length; i += 3) {
    zplCode += `^XA
                  ^PW975
                  ^LL140
                  ^PR6
                  ^MD30
                  ^CI28
                  `;

    zplCode += `
          ^FO28,20^A0N,25,25^FD${locName?.length > 15 ? locName?.split('')?.slice(0, 15)?.join('') + '...' : locName}^FS
          ^FO25,52^A0N,20,20^FD${data[i]?.itemName?.slice(0, 18)}^FS
                   ^FO25,75^BY1,2,40^BCN,40,N,N,N^FD${data[i]?.gtin}^FS

          ^FO25,122^A0N,20,20^FDMRP: ${data[i]?.mrp}  Rs: ${data[i]?.sellingPrice}^FS
          ^FO25,150^A0N,20,15^FDPKD:${formatDate(data[i]?.inwardedOn)}  EXP:${formatDate(data[i]?.expirationDate)}^FS
          ^FO260,20^A0B,20,20^FD ${1234567891234}^FS
          `;

    if (data[i + 1]) {
      zplCode += `
          ^FO308,20^A0N,25,25^FD${
            locName?.length > 15 ? locName?.split('')?.slice(0, 15)?.join('') + '...' : locName
          }^FS
          ^FO305,52^A0N,20,20^FD${data[i + 1]?.itemName?.slice(0, 18)}^FS
           ^FO305,75^BY1,2,40^BCN,40,N,N,N^FD${data[i + 1]?.gtin}^FS
          ^FO305,122^A0N,20,20^FDMRP: ${data[i + 1]?.mrp}  Rs: ${data[i + 1]?.sellingPrice}^FS
          ^FO305,150^A0N,20,15^FDPKD:${formatDate(data[i + 1]?.inwardedOn)}  EXP:${formatDate(
        data[i + 1]?.expirationDate,
      )}^FS
          ^FO540,20^A0B,20,20^FD ${fssaiNumber}^FS
          `;
    }
    if (data[i + 2]) {
      zplCode += `
          ^FO595,20^A0N,25,25^FD${
            locName?.length > 15 ? locName?.split('')?.slice(0, 15)?.join('') + '...' : locName
          }^FS
          ^FO592,52^A0N,20,20^FD${data[i + 2]?.itemName?.slice(0, 18)}^FS
           ^FO592,75^BY1,2,40^BCN,40,N,N,N^FD${data[i + 2]?.gtin}^FS
          ^FO592,122^A0N,20,20^FDMRP: ${data[i + 2]?.mrp}  Rs: ${data[i + 2]?.sellingPrice}^FS
          ^FO592,150^A0N,20,15^FDPKD:${formatDate(data[i + 2]?.inwardedOn)}  EXP:${formatDate(
        data[i + 2]?.expirationDate,
      )}^FS
          ^FO805,20^A0B,20,20^FD ${fssaiNumber}^FS
          `;
    }
    zplCode += `^XZ
  `;
  }

  return zplCode;
};

const create40x20x3 = async (data) => {
  let prnCode = `
SIZE 97.5 mm, 20 mm
DIRECTION 0,0
REFERENCE 0,0
OFFSET 0 mm
SET PEEL OFF
SET CUTTER OFF
SET PARTIAL_CUTTER OFF
SET TEAR ON`;

  let num = 0;
  data?.map((item, index) => {
    if (index < num) return;

    const currentItem = item;
    const nextItem = data[index + 1] || null;
    const secondNextItem = data[index + 2] || null;
    num += 3;

    prnCode += `
CLS
CODEPAGE 1252`;

    if (currentItem?.gtin.length === 13) {
      prnCode += `
BARCODE 765,109,"EAN13",28,0,180,2,4,"${currentItem?.gtin}"
TEXT 765,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[0]}"
TEXT 751,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[1]}"
TEXT 737,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[2]}"
TEXT 723,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[3]}"
TEXT 709,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[4]}"
TEXT 695,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[5]}"
TEXT 681,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[6]}"
TEXT 667,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[7]}"
TEXT 653,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[8]}"
TEXT 639,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[9]}"
TEXT 625,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[10]}"
TEXT 611,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[11]}"
TEXT 597,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[12]}"
`;
    } else if (currentItem?.gtin.length === 8) {
      prnCode += `
BARCODE 765,109,"EAN8",28,0,180,2,4,"${currentItem?.gtin}"
TEXT 765,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[0]}"
TEXT 751,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[1]}"
TEXT 737,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[2]}"
TEXT 723,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[3]}"
TEXT 709,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[4]}"
TEXT 695,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[5]}"
TEXT 681,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[6]}"
TEXT 667,79,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[7]}"`;
    } else {
      prnCode += '';
    }

    prnCode += `
TEXT 765,136,"ROMAN.TTF",180,1,8,"${currentItem?.itemName.slice(0, 22)}"
TEXT 729,42,"ROMAN.TTF",180,1,8,"${currentItem?.mrp}"
TEXT 663,41,"ROMAN.TTF",180,1,7,"Our Price"
TEXT 765,41,"ROMAN.TTF",180,1,7,"MRP"
TEXT 589,42,"ROMAN.TTF",180,1,8,"${currentItem?.sellingPrice}"`;

    if (nextItem) {
      if (nextItem?.gtin.length === 13) {
        prnCode += `
BARCODE 492,109,"EAN13",28,0,180,2,4,"${nextItem?.gtin}"
TEXT 478,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[1]}"
TEXT 464,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[2]}"
TEXT 450,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[3]}"
TEXT 436,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[4]}"
TEXT 422,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[5]}"
TEXT 408,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[6]}"
TEXT 394,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[7]}"
TEXT 380,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[8]}"
TEXT 366,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[9]}"
TEXT 352,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[10]}"
TEXT 338,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[11]}"
TEXT 324,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[12]}"
TEXT 495,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[0]}"`;
      } else if (nextItem?.gtin.length === 8) {
        prnCode += `
BARCODE 492,109,"EAN8",28,0,180,2,4,"${nextItem?.gtin}"
TEXT 492,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[0]}"
TEXT 478,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[1]}"
TEXT 464,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[2]}"
TEXT 450,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[3]}"
TEXT 436,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[4]}"
TEXT 422,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[5]}"
TEXT 408,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[6]}"
TEXT 394,79,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[7]}"`;
      } else {
        prnCode += '';
      }
      prnCode += `
TEXT 492,143,"ROMAN.TTF",180,1,8,"${nextItem?.itemName.slice(0, 22)}"
TEXT 453,42,"ROMAN.TTF",180,1,8,"${nextItem?.mrp}"
TEXT 390,41,"ROMAN.TTF",180,1,7,"Our Price"
TEXT 492,41,"ROMAN.TTF",180,1,7,"MRP"
TEXT 313,42,"ROMAN.TTF",180,1,8,"${nextItem?.sellingPrice}"`;
    }
    if (secondNextItem) {
      if (secondNextItem?.gtin.length === 13) {
        prnCode += `
BARCODE 223,109,"EAN13",28,0,180,2,4,"${secondNextItem?.gtin}"
TEXT 209,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[1]}"
TEXT 195,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[2]}"
TEXT 181,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[3]}"
TEXT 167,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[4]}"
TEXT 153,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[5]}"
TEXT 139,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[6]}"
TEXT 125,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[7]}"
TEXT 111,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[8]}"
TEXT 97,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[9]}"
TEXT 83,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[10]}"
TEXT 69,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[11]}"
TEXT 55,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[12]}"
TEXT 223,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[0]}"`;
      } else if (secondNextItem?.gtin.length === 8) {
        prnCode += `
BARCODE 223,109,"EAN8",28,0,180,2,4,"${secondNextItem?.gtin}"
TEXT 223,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[0]}"
TEXT 209,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[1]}"
TEXT 195,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[2]}"
TEXT 181,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[3]}"
TEXT 167,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[4]}"
TEXT 153,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[5]}"
TEXT 139,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[6]}"
TEXT 125,79,"ROMAN.TTF",180,1,8,"${secondNextItem?.gtin[7]}"`;
      } else {
        prnCode += '';
      }
      prnCode += `
TEXT 223,143,"ROMAN.TTF",180,1,8,"${secondNextItem?.itemName.slice(0, 22)}"
TEXT 187,42,"ROMAN.TTF",180,1,8,"${secondNextItem?.mrp}"
TEXT 121,41,"ROMAN.TTF",180,1,7,"Our Price"
TEXT 223,41,"ROMAN.TTF",180,1,7,"MRP"
TEXT 43,42,"ROMAN.TTF",180,1,8,"${secondNextItem?.sellingPrice}"`;
    }
    prnCode += `
PRINT 1,1

`;
  });

  return prnCode;
};

const create40x25 = async (data) => {
  let prnCode = `
SIZE 77.5 mm, 25 mm
DIRECTION 0,0
REFERENCE 0,0
OFFSET 0 mm
SET PEEL OFF
SET CUTTER OFF
SET PARTIAL_CUTTER OFF
SET TEAR ON`;

  data.map((item, index) => {
    if (index % 2 !== 0) {
      return null; // skip this iteration
    }
    const currentItem = item;
    const nextItem = data[index + 1];

    prnCode += `
CLS
CODEPAGE 1252`;

    if (currentItem?.gtin.length === 13) {
      prnCode += `
BARCODE 555,141,"EAN13",39,0,180,2,4,"${currentItem?.gtin}"
TEXT 547,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[1]}"
TEXT 533,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[2]}"
TEXT 519,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[3]}"
TEXT 504,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[4]}"
TEXT 490,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[5]}"
TEXT 476,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[6]}"
TEXT 455,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[7]}"
TEXT 441,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[8]}"
TEXT 427,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[9]}"
TEXT 413,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[10]}"
TEXT 398,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[11]}"
TEXT 384,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[12]}"
TEXT 573,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[0]}"`;
    } else if (currentItem?.gtin.length === 8) {
      prnCode += `
BARCODE 536,141,"EAN8",39,0,180,2,4,"${currentItem?.gtin}"
TEXT 528,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[0]}"
TEXT 514,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[1]}"
TEXT 499,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[2]}"
TEXT 485,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[3]}"
TEXT 464,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[4]}"
TEXT 450,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[5]}"
TEXT 435,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[6]}"
TEXT 421,100,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[7]}"`;
    } else {
      prnCode += '';
    }

    prnCode += `
TEXT 602,178,"ROMAN.TTF",180,1,9,"${currentItem?.itemName.slice(0, 25)}"
TEXT 532,64,"ROMAN.TTF",180,1,15,"Rs.${currentItem?.mrp}"
TEXT 602,54,"ROMAN.TTF",180,1,9,"Price"`;

    if (nextItem) {
      if (currentItem?.gtin.length === 13) {
        prnCode += `
BARCODE 235,141,"EAN13",39,0,180,2,4,"${nextItem?.gtin}"
TEXT 227,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[1]}"
TEXT 213,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[2]}"
TEXT 199,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[3]}"
TEXT 184,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[4]}"
TEXT 170,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[5]}"
TEXT 156,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[6]}"
TEXT 135,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[7]}"
TEXT 121,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[8]}"
TEXT 107,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[9]}"
TEXT 93,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[10]}"
TEXT 78,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[11]}"
TEXT 64,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[12]}"
TEXT 253,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[0]}"`;
      } else if (currentItem?.gtin.length === 8) {
        prnCode += `
BARCODE 216,141,"EAN8",39,0,180,2,4,"${nextItem?.gtin}"
TEXT 208,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[0]}"
TEXT 194,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[1]}"
TEXT 179,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[2]}"
TEXT 165,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[3]}"
TEXT 144,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[4]}"
TEXT 130,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[5]}"
TEXT 115,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[6]}"
TEXT 101,100,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[7]}"`;
      } else {
        prnCode += '';
      }
      prnCode += `
TEXT 282,178,"ROMAN.TTF",180,1,9,"${nextItem?.itemName.slice(0, 25)}"
TEXT 212,64,"ROMAN.TTF",180,1,15,"Rs.${nextItem?.mrp}"
TEXT 282,54,"ROMAN.TTF",180,1,9,"Price"`;
    }
    prnCode += `
PRINT 1,1

`;
  });

  return prnCode;
};

const create50x25 = async (data) => {
  let prnCode = `
SIZE 97.5 mm, 25 mm
DIRECTION 0,0
REFERENCE 0,0
OFFSET 0 mm
SET PEEL OFF
SET CUTTER OFF
SET PARTIAL_CUTTER OFF
SET TEAR ON`;

  data.map((item, index) => {
    if (index % 2 !== 0) {
      return null; // skip this iteration
    }
    const currentItem = item;
    const nextItem = data[index + 1];

    prnCode += `
CLS
CODEPAGE 1252`;

    if (currentItem?.gtin.length === 13) {
      prnCode += `
BARCODE 717,133,"EAN13",39,0,180,3,6,"${currentItem?.gtin}"
TEXT 703,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[1]}"
TEXT 681,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[2]}"
TEXT 660,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[3]}"
TEXT 638,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[4]}"
TEXT 617,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[5]}"
TEXT 595,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[6]}"
TEXT 565,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[7]}"
TEXT 544,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[8]}"
TEXT 522,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[9]}"
TEXT 501,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[10]}"
TEXT 479,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[11]}"
TEXT 458,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[12]}"
TEXT 744,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[0]}"`;
    } else if (currentItem?.gtin.length === 8) {
      prnCode += `
BARCODE 689,133,"EAN8",39,0,180,3,6,"${currentItem?.gtin}"
TEXT 675,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[0]}"
TEXT 653,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[1]}"
TEXT 631,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[2]}"
TEXT 609,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[3]}"
TEXT 579,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[4]}"
TEXT 558,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[5]}"
TEXT 536,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[6]}"
TEXT 514,92,"ROMAN.TTF",180,1,8,"${currentItem?.gtin[7]}"`;
    } else {
      prnCode += '';
    }

    prnCode += `
TEXT 761,180,"ROMAN.TTF",180,1,11,"${currentItem?.itemName.slice(0, 25)}"
TEXT 673,59,"ROMAN.TTF",180,1,17,"Rs.${currentItem?.mrp}"
TEXT 761,51,"0",180,11,11,"Price"`;

    if (nextItem) {
      if (currentItem?.gtin.length === 13) {
        prnCode += `
BARCODE 317,133,"EAN13",39,0,180,3,6,"${nextItem?.gtin}"
TEXT 303,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[1]}"
TEXT 281,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[2]}"
TEXT 260,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[3]}"
TEXT 238,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[4]}"
TEXT 217,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[5]}"
TEXT 195,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[6]}"
TEXT 165,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[7]}"
TEXT 144,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[8]}"
TEXT 122,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[9]}"
TEXT 101,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[10]}"
TEXT 79,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[11]}"
TEXT 58,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[12]}"
TEXT 344,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[0]}"`;
      } else if (currentItem?.gtin.length === 8) {
        prnCode += `
BARCODE 289,133,"EAN8",39,0,180,3,6,"${nextItem?.gtin}"
TEXT 275,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[0]}"
TEXT 253,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[1]}"
TEXT 231,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[2]}"
TEXT 209,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[3]}"
TEXT 179,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[4]}"
TEXT 158,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[5]}"
TEXT 136,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[6]}"
TEXT 114,92,"ROMAN.TTF",180,1,8,"${nextItem?.gtin[7]}"`;
      } else {
        prnCode += '';
      }
      prnCode += `
TEXT 361,180,"ROMAN.TTF",180,1,11,"${nextItem?.itemName.slice(0, 25)}"
TEXT 273,59,"ROMAN.TTF",180,1,17,"Rs.${nextItem?.mrp}"
TEXT 361,51,"0",180,11,11,"Price"`;
    }
    prnCode += `
PRINT 1,1

`;
  });

  return prnCode;
};

const create40x20NFS = async (data) => {
  let prnCode = `
SIZE 77.5 mm, 20 mm
DIRECTION 0,0
REFERENCE 0,0
OFFSET 0 mm
SET PEEL OFF
SET CUTTER OFF
SET PARTIAL_CUTTER OFF
SET TEAR ON`;

  data.map((item, index) => {
    if (index % 2 !== 0) {
      return null; // skip this iteration
    }
    const currentItem = item;
    const nextItem = data[index + 1];

    prnCode += `
CLS
CODEPAGE 1252`;

    prnCode += `
BOX 325,14,600,145,3
TEXT 578,93,"ROMAN.TTF",180,1,14,"NOT FOR SALE"`;

    if (nextItem) {
      prnCode += `
BOX 5,14,280,145,3
TEXT 258,93,"ROMAN.TTF",180,1,14,"NOT FOR SALE"`;
    }
    prnCode += `
PRINT 1,1

`;
  });

  return prnCode;
};

export {
  create40x20x3,
  create80x35,
  create100x50,
  create50x50,
  create50x40,
  create40x20,
  create40x25,
  create50x25,
  create40x20NFS,
  create40x20x3zebra,
  create40x20x3Godex,
};
