export const statesCode = (state) => {
  if (state) {
    const normalizedState = state?.toLowerCase()?.replace(/\s/g, '');
    switch (normalizedState) {
      case 'andamanandnicobarislands':
        return '35';
      case 'andhrapradesh':
        return '37';
      case 'arunachalpradesh':
        return '12';
      case 'assam':
        return '18';
      case 'bihar':
        return '10';
      case 'chandigarh':
        return '04';
      case 'chhattisgarh':
        return '22';
      case 'dadraandnagarhaveli':
      case 'damananddiu': // Combine these two cases since they share the same code
        return '26';
      case 'delhi':
        return '07';
      case 'goa':
        return '30';
      case 'gujarat':
        return '24';
      case 'haryana':
        return '06';
      case 'himachalpradesh':
        return '02';
      case 'jammuandkashmir':
        return '01';
      case 'jharkhand':
        return '20';
      case 'karnataka':
        return '29';
      case 'kerala':
        return '32';
      case 'ladakh':
        return '38';
      case 'lakshadweep':
        return '31';
      case 'madhyapradesh':
        return '23';
      case 'maharashtra':
        return '27';
      case 'manipur':
        return '14';
      case 'meghalaya':
        return '17';
      case 'mizoram':
        return '15';
      case 'nagaland':
        return '13';
      case 'odisha':
        return '21';
      case 'puducherry':
        return '34';
      case 'punjab':
        return '03';
      case 'rajasthan':
        return '08';
      case 'sikkim':
        return '11';
      case 'tamilnadu':
        return '33'; // Note the change to lowercase here
      case 'telangana':
        return '36';
      case 'tripura':
        return '36'; // Note the change to lowercase here
      case 'uttarpradesh':
        return '09'; // Note the change to lowercase here
      case 'uttarakhand':
        return '05';
      case 'westbengal':
        return '19'; // Note the change to lowercase here
      default:
        return '';
    }
  } else {
    return '';
  }
};
