import { InputAdornment, OutlinedInput } from '@mui/material';
import { memo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import { ClearSoftInput } from '../CommonFunction';

const CommonSearchBar = memo(
  ({ searchValue, handleClearSearchInput, searchFunction, handleNewBtnFunction, placeholder, handleNewRequired }) => {
    return (
      <SoftBox
        className="po-btn-main-div"
        sx={{
          height: 'auto',
          // width: handleNewRequired !== false ? '80%' : '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <SoftBox className="new-po-search-button-div">
          <OutlinedInput
            placeholder={placeholder}
            className="search-input-po"
            value={searchValue}
            sx={{
              borderRadius: '100vw 100vw 100vw 100vw !important',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0px 10px 15px !important',
              // marginRight: '10px !important',
              border: '1px solid gainsboro !important',
            }}
            onChange={searchFunction}
            endAdornment={
              <InputAdornment position="end">
                <SoftBox
                  className={'search-icon-po'}
                  sx={{ backgroundColor: searchValue !== '' && handleClearSearchInput && 'white !important' }}
                >
                  {searchValue && handleClearSearchInput ? (
                    <ClearSoftInput clearInput={handleClearSearchInput} marginTop="6px" />
                  ) : (
                    <SearchIcon />
                  )}
                </SoftBox>
              </InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              'aria-label': 'weight',
            }}
          />
        </SoftBox>
        {handleNewRequired !== false && (
          <SoftBox
          // className="new-po-add-button-div"
          >
            <SoftButton className="new-po-add-button" onClick={handleNewBtnFunction}>
              <AddIcon />
            </SoftButton>
          </SoftBox>
        )}
      </SoftBox>
    );
  },
);

export default CommonSearchBar;
