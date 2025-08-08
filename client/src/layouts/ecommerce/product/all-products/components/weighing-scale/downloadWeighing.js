import * as ExcelJS from 'exceljs';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SoftButton from '../../../../../../components/SoftButton';

const ExcelDownloadButton = ({ data }) => {
  const allLanguages = data.reduce((languages, item) => {
    return languages?.concat(item?.languages?.map(lang => lang?.language));
  }, []);

  const uniqueLanguages = [...new Set(allLanguages)];

  const selectedKeysArray = data?.map(({ product, gtin, languages }) => {
    const langData = uniqueLanguages?.reduce((langData, lang) => {
      langData[lang] = languages?.find(langItem => langItem?.language === lang)?.name || '';
      return langData;
    }, {});

    return {
      'pluname': product,
      'plucode': gtin,
      ...langData,
    };
  });

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Define styles
    const centerAlignedStyle = {
      alignment: { horizontal: 'center' },
      font: { bold: true },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } }
    };

    const leftAlignedStyle = {
      alignment: { horizontal: 'left' }
    };

    // Set dynamic column headings based on unique languages
    worksheet.columns = [
      { key: 'pluname', width: 40 },
      { key: 'plucode', width: 20 },
      ...uniqueLanguages.map(lang => ({ key: lang, width: 20 })),
    ];

    // Add headings including language columns
    worksheet.addRow(['pluname', 'plucode', ...uniqueLanguages]);
    worksheet.getRow(1).fill = centerAlignedStyle.fill;
    worksheet.getRow(1).font = centerAlignedStyle.font;
    worksheet.getRow(1).alignment = centerAlignedStyle.alignment;

    // Add data for each product
    selectedKeysArray.forEach(dataRow => {
      worksheet.addRow(Object.values(dataRow));
    });
    // Apply styles to data cells
    worksheet.eachRow({ includeEmpty: true, skipHeader: true }, (row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.alignment = leftAlignedStyle.alignment;
        if (colNumber === 3 || colNumber === 4) {
          cell.numFmt = '0';
        }
      });
    });

    // Create a Blob with the Excel file data
    const blob = await workbook.xlsx.writeBuffer();

    // Create a downloadable link
    const blobUrl = URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'styledProductData.xlsx';
    link.click();

    // Clean up
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <SoftButton onClick={handleDownload} style={{ marginRight: '20px' }}>
      <FileDownloadIcon />
    </SoftButton>
  );
};

export default ExcelDownloadButton;
