const checkGtinType = (gtin) => {
  if (gtin.toLowerCase().startsWith('w')) {
    const newGtin = gtin.substring(1, 7);
    const quantity = gtin.substring(7);
    return { newGtin, quantity };
  } else {
    return { newGtin: gtin };
  }
};

const checkUnitType = (quantity, uom) => {
  const unit = ['kg', 'kgs', 'kilograms', 'ltr', 'ltrs', 'litres', 'litre'];
  if (unit.some((u) => uom.includes(u))) {
    return quantity / 1000;
  }
  return quantity;
};

const sortItems = (arr) => arr.sort((a, b) => b?.modifiedDate.localeCompare(a?.modifiedDate));

const limitWords = (str, limit) => {
  const words = str.split(' ');
  const limitedWords = words.slice(0, limit);
  return limitedWords.join(' ');
};

const getValueAfterSecondUnderscore = (str) => {
  if (str) {
    const parts = str?.[0]?.split('_');
    if (parts?.length > 2) {
      return parts?.slice(2)?.join('_');
    }
    return null;
  } else {
    return null;
  }
};

export { checkGtinType, checkUnitType, sortItems, limitWords, getValueAfterSecondUnderscore };
