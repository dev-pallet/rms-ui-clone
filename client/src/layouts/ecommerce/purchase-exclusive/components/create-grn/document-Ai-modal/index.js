import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import { IconButton, Tooltip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { preventArrowKeyChange } from '../../../../Common/CommonFunction';
import SoftButton from '../../../../../../components/SoftButton';
import { buttonStyles } from '../../../../Common/buttonColor';
import { getAllProductSuggestionV2 } from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { AddCircleOutline, DeleteOutline } from '@mui/icons-material';
import './DocumentAIModal.css';
import { ArrowUturnDownIcon } from '@heroicons/react/24/solid';

const GRNDocumentAIModal = ({
  documentAIItems,
  setDocumentAIItems,
  isOpen,
  onClose,
  rowData,
  setRowData,
  setIsModalLoading,
  documentJobDetails,
  gstArray = [
    { value: 0, label: '0%' },
    { value: 5, label: '5%' },
    { value: 12, label: '12%' },
    { value: 18, label: '18%' },
    { value: 28, label: '28%' },
  ],
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [editingData, setEditingData] = useState(new Map());
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectedSuggestions, setSelectedSuggestions] = useState(new Set());
  const [barcodeSearchValues, setBarcodeSearchValues] = useState(new Map());
  const [lastProcessedItem, setLastProcessedItem] = useState(null);
  const [apiLoadingStates, setApiLoadingStates] = useState(new Map());
  const [apiResults, setApiResults] = useState(new Map());
  const [focusedRow, setFocusedRow] = useState(null);
  // Store original state for processed items to enable cancel functionality
  const [originalProcessedStates, setOriginalProcessedStates] = useState(new Map());

  const showSnackbar = useSnackbar();
  const locId = localStorage.getItem('locId');

  // Generate unique ID for new rows
  const generateNewRowId = () => {
    return `inserted_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const TotalGrnValue = localStorage.getItem('TotalGrnValue');

  // Create a new empty row structure
  const createNewRow = (insertIndex) => {
    const newId = generateNewRowId();
    return {
      documentItemId: newId,
      itemName: '',
      barCode: '',
      hsn: '',
      quantityOrdered: 1,
      finalPrice: 0,
      unitPrice: 0,
      mrp: 0,
      gst: 0,
      batchNo: '',
      expiryDate: '',
      variantName: '',
      status: 'MANUAL_ENTRY',
      isInsertedRow: true,
      insertIndex: insertIndex,
      suggestedCMSProductList: [],
      documentJobItemId: '',
      suggestedItemId: '',
    };
  };

  // Insert new row at specific index
  const insertNewRow = useCallback(
    (afterIndex) => {
      const newRow = createNewRow(afterIndex);

      setDocumentAIItems((prevItems) => {
        const newItems = [...prevItems];
        // Insert after the specified index
        newItems?.splice(afterIndex + 1, 0, newRow);
        return newItems;
      });

      // Initialize editing data for the new row
      const itemKey = `${newRow?.documentItemId}_document`;
      setEditingData((prevEditingData) => {
        const newEditingData = new Map(prevEditingData);
        newEditingData.set(itemKey, {
          ...newRow,
          expiryDate: '',
          batchNo: '',
        });
        return newEditingData;
      });

      // Set focus to the new row
      setFocusedRow(newRow?.documentItemId);

      showSnackbar('New row inserted successfully', 'success');
    },
    [setDocumentAIItems, showSnackbar],
  );

  // Delete inserted row
  const deleteInsertedRow = useCallback(
    (rowId) => {
      setDocumentAIItems((prevItems) => {
        return prevItems?.filter((item) => item?.documentItemId !== rowId);
      });

      // Remove from editing data
      const itemKey = `${rowId}_document`;
      setEditingData((prevEditingData) => {
        const newEditingData = new Map(prevEditingData);
        newEditingData?.delete(itemKey);
        return newEditingData;
      });

      // Remove from selections
      setSelectedItems((prev) => {
        const newSelected = new Set(prev);
        newSelected?.delete(rowId);
        return newSelected;
      });

      showSnackbar('Row deleted successfully', 'info');
    },
    [setDocumentAIItems, showSnackbar],
  );

  // Enhanced filter to include inserted rows - FIXED
  const filteredDocumentAIItems = useMemo(() => {
    if (!documentAIItems || documentAIItems?.length === 0) return [];

    return documentAIItems?.filter((item) => {
      // Include inserted rows regardless of their values
      if (item?.isInsertedRow) return true;

      // Include processed items to show them in the list
      if (item?.status === 'PROCESSED') return true;

      // Original filter logic for regular items - more lenient filtering
      return (
        item &&
        (item?.quantityOrdered > 0 ||
          item?.finalPrice > 0 ||
          item?.itemName ||
          item?.barCode ||
          item?.status === 'SUGGESTION_PENDING')
      );
    });
  }, [documentAIItems]);

  // Function to calculate similarity score for suggestions
  const calculateSimilarityScore = useCallback((originalItem, suggestion) => {
    let score = 0;
    let maxScore = 0;

    // MRP comparison (weight: 40%)
    if (originalItem?.mrp && suggestion?.mrp) {
      const mrpDiff = Math.abs(originalItem?.mrp - suggestion?.mrp) / Math.max(originalItem?.mrp, suggestion?.mrp);
      score += (1 - mrpDiff) * 40;
    }
    maxScore += 40;

    // GST comparison (weight: 30%)
    if (originalItem?.gst !== undefined && suggestion?.gst !== undefined) {
      if (originalItem?.gst === suggestion?.gst) {
        score += 30;
      }
    }
    maxScore += 30;

    // Unit price comparison (weight: 30%)
    if (originalItem?.unitPrice && suggestion?.unitPrice) {
      const priceDiff =
        Math.abs(originalItem?.unitPrice - suggestion?.unitPrice) /
        Math.max(originalItem?.unitPrice, suggestion?.unitPrice);
      score += (1 - priceDiff) * 30;
    }
    maxScore += 30;

    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  }, []);

  // Function to call API when no barcode match is found - FIXED
  const callBarcodeAPI = useCallback(
    async (itemId, barcode) => {
      if (!barcode.trim()) return;

      const currentItem = documentAIItems?.find((item) => item.documentItemId === itemId);
      if (currentItem?.isInsertedRow) {
        return;
      }

      // Set loading state
      setApiLoadingStates((prev) => new Map(prev).set(itemId, true));

      try {
        const payload = {
          barcode: [barcode.trim()],
          page: 1,
          pageSize: 10,
          query: '',
          storeLocations: [locId],
        };

        const response = await getAllProductSuggestionV2(payload);

        // Process the API response and update the item's suggestions
        if (response?.data?.status === 'SUCCESS' && response?.data?.data?.es === 0) {
          if (!response?.data?.data?.data?.data || response?.data?.data?.data?.data?.length === 0) {
            showSnackbar('No suggestions found for the provided barcode', 'warning');
            setApiResults((prev) => new Map(prev).set(itemId, []));
          } else {
            const apiSuggestions = response?.data?.data?.data?.data?.flatMap((product, index) => {
              return (
                product?.variants?.map((variant, vIndex) => {
                  const inventory = variant?.inventorySync || {};
                  const mrp = variant?.mrpData?.[0]?.mrp || inventory?.mrp || 0;
                  const purchasePrice = inventory?.purchasePrice || 0;
                  const gst = product?.taxReference?.taxRate || 0;
                  const hsn = product?.taxReference?.metadata?.hsnCode || '';
                  const barCode = variant?.barcodes?.[0] || barcode;

                  return {
                    suggestedItemId: `api_${itemId}_${index}_${vIndex}_${Date.now()}`, // Made unique with timestamp
                    barCode: barCode,
                    itemName: product?.name || product?.title || '',
                    hsn: hsn,
                    unitPrice: purchasePrice,
                    mrp: mrp,
                    gst: gst,
                    batchNo: inventory?.batchNo || '',
                    expiryDate: inventory?.expiry || '',
                    // Optional extras
                    brand: product?.companyDetail?.brand || '',
                    manufacturer: product?.companyDetail?.manufacturer || '',
                    variantName: variant?.name || '',
                    unitOfMeasure: variant?.sellingUnits?.[0]?.unitOfMeasure || '',
                    netWeight: variant?.weightsAndMeasures?.[0]?.netWeight || '',
                    // Store the raw data if needed
                    _product: product,
                    _variant: variant,
                  };
                }) || []
              );
            });

            // Store API results
            setApiResults((prev) => new Map(prev).set(itemId, apiSuggestions));

            // Update the document AI items with new suggestions - FIXED to replace instead of append
            setDocumentAIItems((prevItems) => {
              return prevItems?.map((docItem) => {
                if (docItem?.documentItemId === itemId) {
                  // Filter out previous API suggestions and add new ones
                  const existingSuggestions = (docItem?.suggestedCMSProductList || []).filter(
                    (suggestion) => !suggestion?.suggestedItemId?.startsWith('api_'),
                  );

                  return {
                    ...docItem,
                    suggestedCMSProductList: [...existingSuggestions, ...apiSuggestions],
                  };
                }
                return docItem;
              });
            });

            // Update editing data for new suggestions
            setEditingData((prevEditingData) => {
              const newEditingData = new Map(prevEditingData);

              // Remove previous API suggestion editing data for this item
              const keysToRemove = [];
              newEditingData?.forEach((value, key) => {
                if (key?.includes(`${itemId}_api_`) && key?.includes('_suggestion')) {
                  keysToRemove?.push(key);
                }
              });
              keysToRemove?.forEach((key) => newEditingData?.delete(key));

              // Add new API suggestions to editing data
              apiSuggestions?.forEach((suggestion) => {
                const suggestionKey = `${itemId}_${suggestion?.suggestedItemId}_suggestion`;
                newEditingData?.set(suggestionKey, {
                  ...suggestion,
                  expiryDate: suggestion?.expiryDate || '',
                  batchNo: suggestion?.batchNo || '',
                });
              });
              return newEditingData;
            });
          }
        } else {
          setApiResults((prev) => new Map(prev).set(itemId, []));
        }
      } catch (error) {
        setApiResults((prev) => new Map(prev).set(itemId, []));
        showSnackbar('Error fetching suggestions from CMS', 'error');
      } finally {
        setApiLoadingStates((prev) => {
          const newMap = new Map(prev);
          newMap.delete(itemId);
          return newMap;
        });
      }
    },
    [setDocumentAIItems, documentAIItems, locId, showSnackbar],
  );

  // Function to filter suggestions based on barcode search
  const getFilteredSuggestions = useCallback(
    (item) => {
      if (!item?.suggestedCMSProductList?.length) return [];

      const searchValue = barcodeSearchValues.get(item?.documentItemId) || '';
      let suggestions = item?.suggestedCMSProductList;

      // Filter by barcode if search value exists
      if (searchValue.trim()) {
        suggestions = suggestions?.filter((suggestion) =>
          suggestion?.barCode?.toLowerCase().includes(searchValue.toLowerCase()),
        );
      }

      // Add similarity scores and sort
      const suggestionsWithScores = suggestions?.map((suggestion) => ({
        ...suggestion,
        similarityScore: calculateSimilarityScore(item, suggestion),
      }));

      // Sort by similarity score in descending order (best match first)
      return suggestionsWithScores.sort((a, b) => b.similarityScore - a.similarityScore);
    },
    [calculateSimilarityScore, barcodeSearchValues],
  );

  // Function to sort suggestions with best match first (without barcode filtering)
  const getSortedSuggestions = useCallback(
    (item) => {
      if (!item?.suggestedCMSProductList?.length) return [];

      const suggestionsWithScores = item.suggestedCMSProductList?.map((suggestion) => ({
        ...suggestion,
        similarityScore: calculateSimilarityScore(item, suggestion),
      }));

      // Sort by similarity score in descending order (best match first)
      return suggestionsWithScores.sort((a, b) => b.similarityScore - a.similarityScore);
    },
    [calculateSimilarityScore],
  );

  // Auto-expand next unprocessed item when an item is processed
  useEffect(() => {
    if (!filteredDocumentAIItems?.length) return;

    // Find the next unprocessed item with suggestions
    const nextUnprocessedItem = filteredDocumentAIItems?.find(
      (item) =>
        item.status !== 'PROCESSED' &&
        item?.suggestedCMSProductList?.length > 0 &&
        item?.documentItemId !== lastProcessedItem,
    );

    if (nextUnprocessedItem && lastProcessedItem) {
      setExpandedRows((prev) => {
        const newExpanded = new Set();
        // Only expand the next unprocessed item
        newExpanded.add(nextUnprocessedItem.documentItemId);
        return newExpanded;
      });
      // Set focus to the next unprocessed item
      setFocusedRow(nextUnprocessedItem.documentItemId);
    }
  }, [filteredDocumentAIItems, lastProcessedItem]);

  // Initialize editing mode for all items when modal opens - optimized
  useEffect(() => {
    if (!isOpen || !filteredDocumentAIItems?.length) return;

    const newEditingData = new Map();

    filteredDocumentAIItems?.forEach((item) => {
      const itemKey = `${item?.documentItemId}_document`;
      newEditingData.set(itemKey, {
        ...item,
        expiryDate: item?.expiryDate || '',
        batchNo: item?.batchNo || '',
      });

      // Initialize editing data for ALL suggestions to ensure proper sorting
      if (item?.suggestedCMSProductList?.length > 0) {
        const sortedSuggestions = getSortedSuggestions(item);
        sortedSuggestions?.forEach((suggestion) => {
          const suggestionKey = `${item.documentItemId}_${suggestion?.suggestedItemId}_suggestion`;
          newEditingData.set(suggestionKey, {
            ...suggestion,
            documentItem: item,
            expiryDate: suggestion?.expiryDate || '',
            batchNo: suggestion?.batchNo || '',
          });
        });
      }
    });

    setEditingData(newEditingData);
    setSelectedItems(new Set());
    setSelectedSuggestions(new Set());
    setBarcodeSearchValues(new Map());
    setLastProcessedItem(null);
    setApiLoadingStates(new Map()); // Reset API loading states
    setApiResults(new Map()); // Reset API results
    setFocusedRow(null); // Reset focused row

    // Auto-expand first unprocessed item with suggestions
    const firstUnprocessedItem = filteredDocumentAIItems?.find(
      (item) => item.status !== 'PROCESSED' && item?.suggestedCMSProductList?.length > 0,
    );
    if (firstUnprocessedItem?.suggestedCMSProductList?.length > 1) {
      setExpandedRows(new Set([firstUnprocessedItem?.documentItemId]));
      setFocusedRow(firstUnprocessedItem?.documentItemId);
    }
  }, [isOpen, filteredDocumentAIItems, getSortedSuggestions]);

  // Modified toggle function to keep multiple rows expanded
  const toggleRowExpansion = useCallback((itemId) => {
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = new Set(prevExpandedRows);

      // Toggle the specific row - if expanded, collapse it; if collapsed, expand it
      if (newExpandedRows.has(itemId)) {
        newExpandedRows.delete(itemId);
      } else {
        newExpandedRows.add(itemId);
      }

      return newExpandedRows;
    });
    // Set focus when expanding/collapsing
    setFocusedRow(itemId);
  }, []);

  const updateEditingData = useCallback((itemKey, field, value) => {
    setEditingData((prevEditingData) => {
      const newEditingData = new Map(prevEditingData);
      const currentData = newEditingData.get(itemKey) || {};
      newEditingData.set(itemKey, { ...currentData, [field]: value });
      return newEditingData;
    });
  }, []);

  // Enhanced input focus handler
  const handleInputFocus = useCallback((itemId) => {
    setFocusedRow(itemId);
  }, []);

  // Modified handle barcode search with API call
  const handleBarcodeSearch = useCallback(
    (itemId, searchValue) => {
      setBarcodeSearchValues((prev) => {
        const newSearchValues = new Map(prev);
        if (searchValue.trim()) {
          newSearchValues.set(itemId, searchValue);
        } else {
          newSearchValues.delete(itemId);
        }
        return newSearchValues;
      });

      // Also update the editing data
      const itemKey = `${itemId}_document`;
      updateEditingData(itemKey, 'barCode', searchValue);

      // Set focus when searching
      setFocusedRow(itemId);

      // Check if we need to call API (when search has value but no local matches)
      if (searchValue.trim()) {
        const item = filteredDocumentAIItems?.find((doc) => doc?.documentItemId === itemId);
        if (item?.suggestedCMSProductList?.length > 0) {
          const hasLocalMatches = item.suggestedCMSProductList?.some((suggestion) =>
            suggestion?.barCode?.toLowerCase().includes(searchValue.toLowerCase()),
          );

          // If no local matches found, call the API
          if (!hasLocalMatches) {
            callBarcodeAPI(itemId, searchValue);
          }
        } else {
          // If no suggestions at all, call the API
          callBarcodeAPI(itemId, searchValue);
        }
      }
    },
    [updateEditingData, filteredDocumentAIItems, callBarcodeAPI],
  );

  // Handle item selection
  const handleItemSelection = useCallback((itemId, isSelected) => {
    setSelectedItems((prev) => {
      const newSelected = new Set(prev);
      if (isSelected) {
        newSelected.add(itemId);
        // Deselect any suggestions for this item
        setSelectedSuggestions((prevSuggestions) => {
          const newSuggestions = new Set(prevSuggestions);
          // Remove any suggestion keys that start with this itemId
          Array.from(newSuggestions)?.forEach((suggestionKey) => {
            if (suggestionKey.startsWith(`${itemId}_`)) {
              newSuggestions.delete(suggestionKey);
            }
          });
          return newSuggestions;
        });
      } else {
        newSelected.delete(itemId);
      }
      return newSelected;
    });
  }, []);

  // Handle suggestion selection - FIXED
  const handleSuggestionSelection = useCallback((itemId, suggestionId, isSelected) => {
    const suggestionKey = `${itemId}_${suggestionId}`;
    setSelectedSuggestions((prev) => {
      const newSelected = new Set(prev);
      if (isSelected) {
        newSelected.add(suggestionKey);
        // Deselect the main item
        setSelectedItems((prevItems) => {
          const newItems = new Set(prevItems);
          newItems.delete(itemId);
          return newItems;
        });
        // Deselect other suggestions for this item
        Array.from(prev)?.forEach((key) => {
          if (key.startsWith(`${itemId}_`) && key !== suggestionKey) {
            newSelected.delete(key);
          }
        });
      } else {
        newSelected.delete(suggestionKey);
      }
      return newSelected;
    });
  }, []);

  // ADDED: Cancel processed item function
  const handleCancelProcessedItem = useCallback(
    (itemId) => {
      const originalState = originalProcessedStates.get(itemId);
      if (!originalState) return;

      setDocumentAIItems((prevItems) => {
        return prevItems?.map((docItem) => {
          if (docItem?.documentItemId === itemId) {
            return {
              ...originalState,
              documentItemId: itemId, // Keep the same ID
            };
          }
          return docItem;
        });
      });

      // Remove from original states map
      setOriginalProcessedStates((prev) => {
        const newMap = new Map(prev);
        newMap.delete(itemId);
        return newMap;
      });

      // Remove from rowData if exists
      setRowData?.((prevRowData) => {
        return prevRowData?.filter(
          (row) =>
            !(
              row?.documentJobItemId === originalState?.documentJobItemId ||
              row?.suggestedItemId === originalState?.suggestedItemId
            ),
        );
      });

      showSnackbar('Item processing cancelled successfully', 'info');
    },
    [originalProcessedStates, setDocumentAIItems, setRowData, showSnackbar],
  );

  // Handle Done button click - FIXED
  const handleDoneClick = useCallback(() => {
    try {
      localStorage.setItem('expoItems', true);
      const currentRowData = rowData || [];
      let newRowData = [...currentRowData];
      const updatedDocumentItems = [...(documentAIItems || [])];

      // Process selected main items
      selectedItems?.forEach((itemId) => {
        const item = filteredDocumentAIItems?.find((doc) => doc?.documentItemId === itemId);
        if (item && item.status !== 'PROCESSED') {
          // Store original state before processing
          setOriginalProcessedStates((prev) => {
            const newMap = new Map(prev);
            newMap.set(itemId, { ...item });
            return newMap;
          });

          const itemKey = `${item?.documentItemId}_document`;
          const editedData = editingData.get(itemKey) || item;

          const newRowItem = {
            itemNo: editedData?.barCode,
            itemName: editedData?.itemName,
            variantName: editedData?.variantName,
            hsn: editedData?.hsn,
            quantityOrdered: editedData?.quantityOrdered,
            totalPP: editedData?.finalPrice,
            purchasePrice: editedData?.unitPrice,
            mrp: editedData?.mrp,
            sellingPrice: editedData?.unitPrice,
            gst: editedData?.gst,
            expiryDate: editedData?.expiryDate || '',
            batchNumber: editedData?.batchNo || '',
            itemIndex: newRowData.length,
            documentJobItemId: item?.documentJobItemId || '',
            suggestedItemId: item?.suggestedItemId || '',
          };

          newRowData.push(newRowItem);

          // Update document item status
          const docIndex = updatedDocumentItems?.findIndex((docItem) => docItem?.documentItemId === itemId);
          if (docIndex !== -1) {
            updatedDocumentItems[docIndex] = {
              ...updatedDocumentItems[docIndex],
              status: 'PROCESSED',
              isSelected: false,
            };
          }

          // Set this as the last processed item for auto-expand
          setLastProcessedItem(itemId);
        }
      });

      // Process selected suggestions - FIXED
      selectedSuggestions?.forEach((suggestionKey) => {
        const [itemId, ...suggestionIdParts] = suggestionKey.split('_');
        const suggestionId = suggestionIdParts.join('_'); // Handle suggestion IDs with underscores

        const documentItem = filteredDocumentAIItems?.find((doc) => doc?.documentItemId === itemId);
        const suggestedItem = documentItem?.suggestedCMSProductList?.find(
          (suggestion) => suggestion?.suggestedItemId === suggestionId,
        );

        if (documentItem && suggestedItem && documentItem.status !== 'PROCESSED') {
          // Store original state before processing
          setOriginalProcessedStates((prev) => {
            const newMap = new Map(prev);
            newMap.set(itemId, { ...documentItem });
            return newMap;
          });

          const editedData = editingData.get(`${suggestionKey}_suggestion`) || suggestedItem;

          const newRowItem = {
            itemNo: editedData?.barCode || documentItem?.barCode,
            itemName: editedData?.itemName || documentItem?.itemName,
            variantName: documentItem?.variantName,
            hsn: editedData?.hsn || documentItem?.hsn,
            quantityOrdered: documentItem?.quantityOrdered,
            totalPP: documentItem?.finalPrice,
            purchasePrice: editedData?.unitPrice || documentItem?.unitPrice,
            mrp: editedData?.mrp || documentItem?.mrp,
            sellingPrice: editedData?.unitPrice || documentItem?.unitPrice,
            gst: editedData?.gst || documentItem?.gst,
            expiryDate: editedData?.expiryDate || documentItem?.expiryDate || '',
            batchNumber: editedData?.batchNo || documentItem?.batchNo || '',
            itemIndex: newRowData.length,
            documentJobItemId: documentItem?.documentJobItemId || '',
            suggestedItemId: suggestedItem?.suggestedItemId || '',
          };

          newRowData.push(newRowItem);

          // Update document item status and replace with suggestion data
          const docIndex = updatedDocumentItems?.findIndex((docItem) => docItem?.documentItemId === itemId);
          if (docIndex !== -1) {
            updatedDocumentItems[docIndex] = {
              ...updatedDocumentItems[docIndex],
              ...editedData,
              status: 'PROCESSED',
              isSelected: false,
              documentItemId: updatedDocumentItems[docIndex]?.documentItemId,
              documentJobItemId: updatedDocumentItems[docIndex]?.documentJobItemId,
              quantityOrdered: updatedDocumentItems[docIndex]?.quantityOrdered,
              finalPrice: updatedDocumentItems[docIndex]?.finalPrice,
              suggestedCMSProductList: [],
            };
          }

          // Set this as the last processed item for auto-expand
          setLastProcessedItem(itemId);
        }
      });

      // Update state
      setRowData?.(newRowData);
      setDocumentAIItems?.(updatedDocumentItems);

      // Clear selections but don't collapse rows (auto-expand will handle it)
      setSelectedItems(new Set());
      setSelectedSuggestions(new Set());
    } catch (error) {
      showSnackbar('Error processing items. Please try again.', 'error');
    }
  }, [
    selectedItems,
    selectedSuggestions,
    filteredDocumentAIItems,
    editingData,
    rowData,
    setRowData,
    documentAIItems,
    setDocumentAIItems,
    setOriginalProcessedStates,
    showSnackbar,
  ]);

  const calculateMargin = useCallback((mrp, unitPrice) => {
    if (mrp && unitPrice && mrp > 0 && unitPrice > 0) {
      return Math.abs((((mrp - unitPrice) / mrp) * 100).toFixed(1));
    }
    return 0;
  }, []);

  // Handle keyboard navigation
  const itemRefs = useRef([]);

  const handleKeyDown = useCallback((e, action, index, ...args) => {
    const totalItems = itemRefs.current.length;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action(...args);
    }
  }, []);

  const renderSuggestionRow = useCallback(
    (item, suggestion, suggestionIndex, isBestMatch = false, similarityScore = 0) => {
      const suggestionKey = `${item?.documentItemId}_${suggestion?.suggestedItemId}_suggestion`;
      const editedData = editingData.get(suggestionKey) || suggestion;
      const suggestionMargin = calculateMargin(editedData?.mrp, editedData?.unitPrice);
      const selectionKey = `${item?.documentItemId}_${suggestion?.suggestedItemId}`;
      const isSelected = selectedSuggestions.has(selectionKey);

      // Check if this is an API-generated suggestion
      const isApiSuggestion = suggestion?.suggestedItemId?.startsWith('api_');

      // Enhanced background colors based on focus and selection
      const isFocused = focusedRow === item?.documentItemId;
      let backgroundColor = '#f3f8ff'; // Default light blue

      if (isBestMatch) {
        backgroundColor = isFocused ? '#fff0e0' : '#fff3e0'; // Orange tones
      } else if (isApiSuggestion) {
        backgroundColor = isFocused ? '#e8f8e8' : '#f0f8f0'; // Green tones
      } else if (isFocused) {
        backgroundColor = '#e8f4ff'; // Brighter blue when focused
      }

      const borderColor = isBestMatch ? '#ff9800' : isApiSuggestion ? '#4caf50' : '#2196f3';
      const inputBackgroundColor = isBestMatch ? '#fff8e1' : isApiSuggestion ? '#f8fff8' : '#f8fbff';

      return (
        <tr
          key={`${item?.documentItemId}-suggestion-${suggestionIndex}`}
          className="grn-ai-suggestion-row"
          style={{
            backgroundColor: backgroundColor,
            borderLeft: `4px solid ${borderColor}`,
            position: 'relative',
            boxShadow: isBestMatch
              ? '0 2px 4px rgba(255, 152, 0, 0.1)'
              : isApiSuggestion
              ? '0 2px 4px rgba(76, 175, 80, 0.1)'
              : isFocused
              ? '0 2px 8px rgba(33, 150, 243, 0.2)'
              : '0 1px 3px rgba(33, 150, 243, 0.1)',
            transition: 'all 0.2s ease',
          }}
        >
          <td className="express-grn-rows">
            <div className="grn-ai-flex-center">
              <div className="grn-ai-bar" />
              <SoftBox className="express-grn-offer-icon">
                <LocalOfferIcon color="action" />
                {isBestMatch && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      fontSize: '10px',
                      backgroundColor: '#ff9800',
                      color: 'white',
                      padding: '2px 4px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      zIndex: 1,
                    }}
                  >
                    BEST MATCH ({Math.round(similarityScore)}%)
                  </div>
                )}
                {isApiSuggestion && !isBestMatch && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      fontSize: '10px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      padding: '2px 4px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      zIndex: 1,
                    }}
                  >
                    CMS
                  </div>
                )}
              </SoftBox>
            </div>
          </td>

          <td className="express-grn-rows">
            <SoftBox className="express-grn-product-box">
              <SoftInput
                value={editedData?.barCode || ''}
                onChange={(e) => updateEditingData(suggestionKey, 'barCode', e.target.value)}
                onFocus={() => handleInputFocus(item?.documentItemId)}
                className="grn-ai-softinput"
                style={{
                  backgroundColor: inputBackgroundColor,
                  border: isFocused ? '2px solid #1976d2' : '1px solid #e0e0e0',
                }}
              />
            </SoftBox>
          </td>

          <td className="express-grn-rows">
            <SoftBox className="express-grn-product-box">
              <SoftInput
                value={editedData?.itemName || ''}
                onChange={(e) => updateEditingData(suggestionKey, 'itemName', e.target.value)}
                onFocus={() => handleInputFocus(item?.documentItemId)}
                className="grn-ai-softinput"
                style={{
                  backgroundColor: inputBackgroundColor,
                  border: isFocused ? '2px solid #1976d2' : '1px solid #e0e0e0',
                }}
              />
            </SoftBox>
          </td>

          <td className="express-grn-rows"></td>
          <td className="express-grn-rows"></td>

          <td className="express-grn-rows">
            <SoftBox className="grn-body-row-boxes-1">
              <SoftInput
                value={editedData?.unitPrice || 0}
                onChange={(e) => updateEditingData(suggestionKey, 'unitPrice', e.target.value)}
                onFocus={() => handleInputFocus(item?.documentItemId)}
                className="product-aligning grn-ai-softinput"
                type="number"
                onKeyDown={preventArrowKeyChange}
                style={{
                  backgroundColor: inputBackgroundColor,
                  border: isFocused ? '2px solid #1976d2' : '1px solid #e0e0e0',
                }}
              />
            </SoftBox>
          </td>

          <td className="express-grn-rows">
            <SoftBox className="grn-body-row-boxes-1">
              <SoftInput
                value={editedData?.mrp || 0}
                onChange={(e) => updateEditingData(suggestionKey, 'mrp', e.target.value)}
                onFocus={() => handleInputFocus(item?.documentItemId)}
                className="product-aligning grn-ai-softinput"
                type="number"
                onKeyDown={preventArrowKeyChange}
                style={{
                  backgroundColor: inputBackgroundColor,
                  border: isFocused ? '2px solid #1976d2' : '1px solid #e0e0e0',
                }}
              />
            </SoftBox>
          </td>

          <td className="express-grn-rows">
            <SoftBox className="grn-body-row-boxes-1">
              <SoftInput
                value={editedData?.unitPrice || 0}
                disabled
                className="product-aligning grn-ai-disabled"
                type="number"
              />
            </SoftBox>
          </td>

          <td className="express-grn-rows">
            <SoftBox className="grn-body-row-boxes-1">
              <SoftInput
                value={suggestionMargin}
                disabled
                className={`product-aligning grn-ai-margin ${
                  suggestionMargin > 0 ? 'grn-ai-positive' : 'grn-ai-negative'
                }`}
                type="number"
              />
            </SoftBox>
          </td>

          <td className="express-grn-rows">
            <SoftBox className="grn-body-row-boxes-1">
              <SoftSelect
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                  control: (base) => ({
                    ...base,
                    backgroundColor: inputBackgroundColor,
                    border: isFocused ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  }),
                }}
                value={gstArray?.find((option) => option.value == editedData?.gst) || gstArray[0]}
                onChange={(e) => updateEditingData(suggestionKey, 'gst', e.value)}
                onFocus={() => handleInputFocus(item?.documentItemId)}
                options={gstArray}
              />
            </SoftBox>
          </td>

          <td className="express-grn-rows">
            <SoftBox className="grn-body-row-boxes-1">
              <SoftInput
                value={editedData?.batchNo || ''}
                onChange={(e) => updateEditingData(suggestionKey, 'batchNo', e.target.value)}
                onFocus={() => handleInputFocus(item?.documentItemId)}
                className="grn-ai-softinput"
                type="text"
                style={{
                  backgroundColor: inputBackgroundColor,
                  border: isFocused ? '2px solid #1976d2' : '1px solid #e0e0e0',
                }}
              />
            </SoftBox>
          </td>

          <td className="express-grn-rows">
            <SoftBox className="grn-body-row-boxes-1">
              <SoftInput
                value={editedData?.expiryDate || ''}
                onChange={(e) => updateEditingData(suggestionKey, 'expiryDate', e.target.value)}
                onFocus={() => handleInputFocus(item?.documentItemId)}
                className="grn-ai-softinput"
                type="date"
                style={{
                  backgroundColor: inputBackgroundColor,
                  border: isFocused ? '2px solid #1976d2' : '1px solid #e0e0e0',
                }}
              />
            </SoftBox>
          </td>

          <td className="express-grn-rows">
            <div className="grn-ai-center-text">
              <SoftTypography variant="caption" color="text">
                {''}
              </SoftTypography>
            </div>
          </td>

          <td className="express-grn-rows">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                checked={isSelected}
                onChange={(e) =>
                  handleSuggestionSelection(item?.documentItemId, suggestion?.suggestedItemId, e.target.checked)
                }
              />
            </div>
          </td>
        </tr>
      );
    },
    [
      editingData,
      calculateMargin,
      updateEditingData,
      gstArray,
      handleKeyDown,
      selectedSuggestions,
      handleSuggestionSelection,
      focusedRow,
      handleInputFocus,
    ],
  );

  // Render Insert Row Button
  const renderInsertRowButton = useCallback(
    (index) => {
      const button = (
        <SoftButton
          variant="outlined"
          size="small"
          onClick={() => insertNewRow(index)}
          style={{
            minHeight: '24px',
            fontSize: '12px',
            padding: '2px 8px',
            borderColor: '#1976d2',
            color: '#1976d2',
            backgroundColor: 'transparent',
          }}
          startIcon={<AddCircleOutline style={{ fontSize: '14px' }} />}
        >
          Insert Row
        </SoftButton>
      );

      return (
        <tr key={`insert-button-${index}`} style={{ backgroundColor: '#f8f9fa' }}>
          <td colSpan="14" style={{ padding: '4px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
            {/* Show tooltip only for top insert button */}
            {index === -1 ? (
              <Tooltip title="Insert a new row at the top" placement="top">
                <span>{button}</span>
              </Tooltip>
            ) : (
              button
            )}
          </td>
        </tr>
      );
    },
    [insertNewRow],
  );

  // Early return optimization
  if (!isOpen) return null;

  // Show message if no valid items
  if (!filteredDocumentAIItems?.length) {
    return (
      <div className="grn-ai-modal-overlay">
        <div className="grn-ai-modal-container">
          <div className="grn-ai-modal-header">
            <SoftTypography variant="h4" fontWeight="bold" color="white">
              AI Suggestions - No Items Found
            </SoftTypography>
            <button
              className="grn-ai-close-button"
              onClick={() => {
                onClose();
                setIsModalLoading(false);
              }}
              onMouseEnter={(e) => e.target.classList.add('grn-ai-close-hover')}
              onMouseLeave={(e) => e.target.classList.remove('grn-ai-close-hover')}
            >
              ×
            </button>
          </div>
          <div className="grn-ai-modal-content">
            <SoftTypography variant="h6" color="text">
              No items found with valid data.
            </SoftTypography>
            {/* <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <SoftTypography variant="body2" color="text">
                Debug Info:
                <br />• Total documentAIItems: {documentAIItems?.length || 0}
                <br />• Filtered items: {filteredDocumentAIItems?.length || 0}
                <br />• Items with quantity & price:{' '}
                {documentAIItems?.filter((item) => item?.quantityOrdered > 0 && item?.finalPrice > 0)?.length || 0}
              </SoftTypography>
            </div> */}
            <SoftButton
              variant="outlined"
              className="grn-ai-close-button-secondary"
              onClick={() => {
                onClose();
                setIsModalLoading(false);
              }}
              style={{ marginTop: '16px' }}
            >
              Close
            </SoftButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grn-ai-modal-overlay">
      <div className="grn-ai-modal-container">
        <div className="grn-ai-modal-header">
          <div className="grn-ai-header-left">
            <div className="grn-ai-icon-circle">
              <LocalOfferIcon className="grn-ai-icon" />
            </div>
            <div className="grn-ai-title-container">
              <SoftTypography variant="h4" fontWeight="bold" color="white" className="grn-ai-title">
                AI Suggestions
              </SoftTypography>
              <SoftTypography variant="body2" className="grn-ai-subtitle" style={{ color: 'white' }}>
                Review and select AI-suggested products for your Inward(GRN)
              </SoftTypography>
            </div>
          </div>
          <button
            className="grn-ai-close-button"
            onClick={() => {
              onClose();
              setIsModalLoading(false);
            }}
            onMouseEnter={(e) => e.currentTarget.classList.add('hover')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
          >
            ×
          </button>
        </div>

        <div className="grn-ai-modal-content">
          {/* Legend */}
          <SoftBox
            mb={2}
            p={2}
            sx={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div className="grn-ai-legend-row">
                <div className="grn-ai-legend-left">
                  <div className="grn-ai-legend-item">
                    <div className="grn-ai-legend-color-box grn-ai-original-item"></div>
                    <SoftTypography variant="caption">Invoice Items</SoftTypography>
                  </div>
                  <div className="grn-ai-legend-item">
                    <div
                      className="grn-ai-legend-color-box"
                      style={{ backgroundColor: '#fff3e0', border: '2px solid #ff9800' }}
                    ></div>
                    <SoftTypography variant="caption" color="warning">
                      Best Match Suggestion
                    </SoftTypography>
                  </div>
                  <div className="grn-ai-legend-item">
                    <div
                      className="grn-ai-legend-color-box"
                      style={{ backgroundColor: '#f0f8f0', border: '2px solid #4caf50' }}
                    ></div>
                    <SoftTypography variant="caption" color="success">
                      CMS API Suggestions
                    </SoftTypography>
                  </div>
                  <div className="grn-ai-legend-item">
                    <div
                      className="grn-ai-legend-color-box"
                      style={{ backgroundColor: '#fff8e1', border: '2px solid #ffc107' }}
                    ></div>
                    <SoftTypography variant="caption" style={{ color: '#f57c00' }}>
                      Inserted Rows
                    </SoftTypography>
                  </div>
                  <div className="grn-ai-legend-item">
                    <div
                      className="grn-ai-legend-color-box"
                      style={{ backgroundColor: '#e8f4ff', border: '2px solid #1976d2' }}
                    ></div>
                    <SoftTypography variant="caption" color="primary">
                      Currently Working Row
                    </SoftTypography>
                  </div>
                </div>

                <div className="grn-ai-legend-right">
                  <div className="grn-ai-legend-item">
                    <div className="grn-ai-legend-color-box grn-ai-primary-suggestion"></div>
                    <SoftTypography variant="caption" color="primary">
                      Other Suggestions
                    </SoftTypography>
                  </div>
                  <SoftTypography variant="caption" color="primary">
                    Invoice Number: {documentJobDetails?.invoiceNumber || 'NA'}
                  </SoftTypography>
                  <SoftTypography variant="caption" color="primary">
                    Total Amount: {documentJobDetails?.totalAmount || 'NA'}
                  </SoftTypography>
                  <SoftTypography variant="caption" color="primary">
                    Invoice Date: {documentJobDetails?.invoiceDate || 'NA'}
                  </SoftTypography>
                </div>
              </div>
            </div>
          </SoftBox>

          {/* Table Container */}
          <SoftBox
            style={{
              flex: 1,
              overflowX: 'auto',
              overflowY: 'auto',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: 'white',
            }}
          >
            <div style={{ minWidth: '1400px', height: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                    <th
                      className="express-grn-columns"
                      style={{ padding: '12px 8px', fontWeight: 'bold', fontSize: '0.9rem', width: '50px' }}
                    >
                      S.No
                    </th>
                    <th
                      className="express-grn-barcode-column"
                      style={{
                        padding: '12px 8px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        minWidth: '160px',
                        maxWidth: '180px',
                      }}
                    >
                      Barcode
                    </th>
                    <th
                      className="express-grn-barcode-column"
                      style={{
                        padding: '12px 8px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        minWidth: '350px',
                        maxWidth: '400px',
                      }}
                    >
                      Product Title
                    </th>
                    <th
                      className="express-grn-columns"
                      style={{ padding: '12px 8px', fontWeight: 'bold', fontSize: '0.9rem', maxWidth: '60px' }}
                    >
                      Qty
                    </th>
                    <th
                      className="express-grn-columns"
                      style={{ padding: '12px 8px', fontWeight: 'bold', fontSize: '0.9rem', width: '80px' }}
                    >
                      Total PP
                    </th>
                    <th
                      className="express-grn-columns"
                      style={{ padding: '12px 8px', fontWeight: 'bold', fontSize: '0.9rem', width: '90px' }}
                    >
                      Price/Unit
                    </th>
                    <th
                      className="express-grn-columns"
                      style={{ padding: '12px 8px', fontWeight: 'bold', fontSize: '0.9rem', width: '70px' }}
                    >
                      MRP
                    </th>
                    <th
                      className="express-grn-columns"
                      style={{ padding: '12px 8px', fontWeight: 'bold', fontSize: '0.9rem', width: '70px' }}
                    >
                      S Price
                    </th>
                    <th
                      className="express-grn-columns"
                      style={{ padding: '12px 8px', fontWeight: 'bold', fontSize: '0.9rem', width: '80px' }}
                    >
                      P Margin
                    </th>
                    <th
                      className="express-grn-columns"
                      style={{ padding: '12px 8px', fontWeight: 'bold', fontSize: '0.9rem', width: '60px' }}
                    >
                      GST
                    </th>
                    <th
                      className="express-grn-columns"
                      style={{ padding: '12px 8px', fontWeight: 'bold', fontSize: '0.9rem', width: '100px' }}
                    >
                      Batch No
                    </th>
                    <th
                      className="express-grn-columns"
                      style={{ padding: '12px 8px', fontWeight: 'bold', fontSize: '0.9rem', width: '100px' }}
                    >
                      Expiry Date
                    </th>
                    <th
                      className="express-grn-columns"
                      style={{ padding: '12px 8px', fontWeight: 'bold', fontSize: '0.9rem', width: '120px' }}
                    >
                      {''}
                    </th>
                    <th
                      className="express-grn-columns"
                      style={{ padding: '12px 8px', fontWeight: 'bold', fontSize: '0.9rem', width: '80px' }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Insert button at the beginning */}
                  {renderInsertRowButton(-1)}

                  {filteredDocumentAIItems?.map((item, index) => {
                    const itemKey = `${item?.documentItemId}_document`;
                    const editedData = editingData.get(itemKey) || item;
                    const margin = calculateMargin(editedData?.mrp, editedData?.unitPrice);
                    const hasSuggestions = item?.suggestedCMSProductList?.length > 0;
                    const isExpanded = expandedRows?.has(item?.documentItemId);
                    const isProcessed = item?.status === 'PROCESSED';
                    const isSelected = selectedItems.has(item?.documentItemId);
                    const isApiLoading = apiLoadingStates.get(item?.documentItemId);
                    const isFocused = focusedRow === item?.documentItemId;
                    const isInsertedRow = item?.isInsertedRow;

                    // Get filtered suggestions based on barcode search
                    const filteredSuggestions = getFilteredSuggestions(item);
                    const searchValue = barcodeSearchValues.get(item?.documentItemId) || '';

                    // Enhanced row styling based on focus and processing status
                    const getRowStyle = () => {
                      if (isProcessed) {
                        return {
                          backgroundColor: '#e8f5e8',
                          borderLeft: '4px solid #4caf50',
                          borderBottom: '1px solid #e0e0e0',
                        };
                      }
                      if (isInsertedRow) {
                        return {
                          backgroundColor: isFocused ? '#fff8e1' : '#fffbf0',
                          borderLeft: '4px solid #ffc107',
                          borderBottom: '1px solid #e0e0e0',
                          boxShadow: isFocused
                            ? '0 2px 8px rgba(255, 193, 7, 0.2)'
                            : '0 1px 3px rgba(255, 193, 7, 0.1)',
                          transition: 'all 0.2s ease',
                        };
                      }
                      if (isFocused) {
                        return {
                          backgroundColor: '#e8f4ff',
                          borderLeft: '4px solid #1976d2',
                          borderBottom: '1px solid #e0e0e0',
                          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                          transition: 'all 0.2s ease',
                        };
                      }
                      return {
                        backgroundColor: 'white',
                        borderLeft: '4px solid #4caf50',
                        borderBottom: '1px solid #e0e0e0',
                      };
                    };

                    const rows = [
                      // Main document item row
                      <tr key={item?.documentItemId} style={getRowStyle()}>
                        <td className="express-grn-rows" style={{ padding: '8px' }}>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              fontSize: '0.85rem',
                            }}
                          >
                            {isProcessed ? (
                              <Tooltip title="Product is processed">
                                <SoftBox className="grn-body-row-boxes">
                                  <SoftInput
                                    value={index + 1}
                                    readOnly={true}
                                    type="number"
                                    className="product-aligning"
                                    sx={{
                                      '&.MuiInputBase-root': {
                                        backgroundColor: 'green !important',
                                        color: '#fff !important',
                                      },
                                    }}
                                  />
                                </SoftBox>
                              </Tooltip>
                            ) : (
                              <SoftBox className="grn-body-row-boxes" style={{ position: 'relative' }}>
                                <SoftInput
                                  value={index + 1}
                                  readOnly={true}
                                  type="number"
                                  className="product-aligning"
                                  style={{
                                    backgroundColor: isInsertedRow
                                      ? isFocused
                                        ? '#fff8e1'
                                        : '#fffbf0'
                                      : isFocused
                                      ? '#e3f2fd'
                                      : 'white',
                                    border: isInsertedRow
                                      ? isFocused
                                        ? '2px solid #ffc107'
                                        : '1px solid #ffc107'
                                      : isFocused
                                      ? '2px solid #1976d2'
                                      : '1px solid #e0e0e0',
                                  }}
                                />
                                {isInsertedRow && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: '-2px',
                                      right: '-2px',
                                      fontSize: '8px',
                                      backgroundColor: '#ffc107',
                                      color: 'white',
                                      padding: '1px 3px',
                                      borderRadius: '4px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    NEW
                                  </div>
                                )}
                                {isFocused && !isInsertedRow && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: '-2px',
                                      right: '-2px',
                                      width: '8px',
                                      height: '8px',
                                      backgroundColor: '#1976d2',
                                      borderRadius: '50%',
                                      animation: 'pulse 2s infinite',
                                    }}
                                  />
                                )}
                              </SoftBox>
                            )}
                          </span>
                        </td>
                        <td className="express-grn-rows" style={{ padding: '8px' }}>
                          <SoftBox className="express-grn-product-box">
                            <SoftInput
                              value={editedData?.barCode || ''}
                              onChange={(e) => handleBarcodeSearch(item?.documentItemId, e.target.value)}
                              onFocus={() => handleInputFocus(item?.documentItemId)}
                              style={{
                                width: '100%',
                                border: isInsertedRow
                                  ? isFocused
                                    ? '2px solid #ffc107'
                                    : '1px solid #ffc107'
                                  : isFocused
                                  ? '2px solid #1976d2'
                                  : '1px solid #e0e0e0',
                                backgroundColor: isInsertedRow
                                  ? isFocused
                                    ? '#fff8e1'
                                    : '#fffbf0'
                                  : isFocused
                                  ? '#e3f2fd'
                                  : 'white',
                              }}
                              disabled={isProcessed}
                              placeholder="🔍 Search barcode"
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows" style={{ padding: '8px' }}>
                          <SoftBox className="express-grn-product-box">
                            <SoftInput
                              value={editedData?.itemName || ''}
                              onChange={(e) => updateEditingData(itemKey, 'itemName', e.target.value)}
                              onFocus={() => handleInputFocus(item?.documentItemId)}
                              style={{
                                width: '100%',
                                border: isInsertedRow
                                  ? isFocused
                                    ? '2px solid #ffc107'
                                    : '1px solid #ffc107'
                                  : isFocused
                                  ? '2px solid #1976d2'
                                  : '1px solid #e0e0e0',
                                backgroundColor: isInsertedRow
                                  ? isFocused
                                    ? '#fff8e1'
                                    : '#fffbf0'
                                  : isFocused
                                  ? '#e3f2fd'
                                  : 'white',
                              }}
                              disabled={isProcessed}
                              placeholder="Enter product name"
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows" style={{ padding: '8px' }}>
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput
                              value={editedData?.quantityOrdered || 0}
                              onChange={(e) => updateEditingData(itemKey, 'quantityOrdered', e.target.value)}
                              onFocus={() => handleInputFocus(item?.documentItemId)}
                              className="product-aligning"
                              type="number"
                              onKeyDown={preventArrowKeyChange}
                              disabled={isProcessed}
                              style={{
                                border: isInsertedRow
                                  ? isFocused
                                    ? '2px solid #ffc107'
                                    : '1px solid #ffc107'
                                  : isFocused
                                  ? '2px solid #1976d2'
                                  : '1px solid #e0e0e0',
                                backgroundColor: isInsertedRow
                                  ? isFocused
                                    ? '#fff8e1'
                                    : '#fffbf0'
                                  : isFocused
                                  ? '#e3f2fd'
                                  : 'white',
                              }}
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows" style={{ padding: '8px' }}>
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput
                              value={editedData?.finalPrice || 0}
                              onChange={(e) => updateEditingData(itemKey, 'finalPrice', e.target.value)}
                              onFocus={() => handleInputFocus(item?.documentItemId)}
                              className="product-aligning"
                              type="number"
                              onKeyDown={preventArrowKeyChange}
                              disabled={isProcessed}
                              style={{
                                border: isInsertedRow
                                  ? isFocused
                                    ? '2px solid #ffc107'
                                    : '1px solid #ffc107'
                                  : isFocused
                                  ? '2px solid #1976d2'
                                  : '1px solid #e0e0e0',
                                backgroundColor: isInsertedRow
                                  ? isFocused
                                    ? '#fff8e1'
                                    : '#fffbf0'
                                  : isFocused
                                  ? '#e3f2fd'
                                  : 'white',
                              }}
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows" style={{ padding: '8px' }}>
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput
                              value={editedData?.unitPrice || 0}
                              onChange={(e) => updateEditingData(itemKey, 'unitPrice', e.target.value)}
                              onFocus={() => handleInputFocus(item?.documentItemId)}
                              className="product-aligning"
                              type="number"
                              onKeyDown={preventArrowKeyChange}
                              disabled={isProcessed}
                              style={{
                                border: isInsertedRow
                                  ? isFocused
                                    ? '2px solid #ffc107'
                                    : '1px solid #ffc107'
                                  : isFocused
                                  ? '2px solid #1976d2'
                                  : '1px solid #e0e0e0',
                                backgroundColor: isInsertedRow
                                  ? isFocused
                                    ? '#fff8e1'
                                    : '#fffbf0'
                                  : isFocused
                                  ? '#e3f2fd'
                                  : 'white',
                              }}
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows" style={{ padding: '8px' }}>
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput
                              value={editedData?.mrp || 0}
                              onChange={(e) => updateEditingData(itemKey, 'mrp', e.target.value)}
                              onFocus={() => handleInputFocus(item?.documentItemId)}
                              className="product-aligning"
                              type="number"
                              onKeyDown={preventArrowKeyChange}
                              disabled={isProcessed}
                              style={{
                                border: isInsertedRow
                                  ? isFocused
                                    ? '2px solid #ffc107'
                                    : '1px solid #ffc107'
                                  : isFocused
                                  ? '2px solid #1976d2'
                                  : '1px solid #e0e0e0',
                                backgroundColor: isInsertedRow
                                  ? isFocused
                                    ? '#fff8e1'
                                    : '#fffbf0'
                                  : isFocused
                                  ? '#e3f2fd'
                                  : 'white',
                              }}
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows" style={{ padding: '8px' }}>
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput
                              value={editedData?.unitPrice || 0}
                              disabled
                              className="product-aligning"
                              type="number"
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows" style={{ padding: '8px' }}>
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput
                              value={margin}
                              disabled
                              className={`product-aligning ${margin > 0 ? 'grn-ai-positive' : 'grn-ai-negative'}`}
                              type="number"
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows" style={{ padding: '8px' }}>
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftSelect
                              menuPortalTarget={document.body}
                              value={gstArray?.find((option) => option.value == editedData?.gst) || gstArray[0]}
                              onChange={(e) => updateEditingData(itemKey, 'gst', e.value)}
                              onFocus={() => handleInputFocus(item?.documentItemId)}
                              options={gstArray}
                              isDisabled={isProcessed}
                              styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                                control: (base) => ({
                                  ...base,
                                  border: isInsertedRow
                                    ? isFocused
                                      ? '2px solid #ffc107'
                                      : '1px solid #ffc107'
                                    : isFocused
                                    ? '2px solid #1976d2'
                                    : '1px solid #e0e0e0',
                                  backgroundColor: isInsertedRow
                                    ? isFocused
                                      ? '#fff8e1'
                                      : '#fffbf0'
                                    : isFocused
                                    ? '#e3f2fd'
                                    : 'white',
                                }),
                              }}
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows" style={{ padding: '8px' }}>
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput
                              value={editedData?.batchNo || ''}
                              onChange={(e) => updateEditingData(itemKey, 'batchNo', e.target.value)}
                              onFocus={() => handleInputFocus(item?.documentItemId)}
                              type="text"
                              disabled={isProcessed}
                              style={{
                                border: isInsertedRow
                                  ? isFocused
                                    ? '2px solid #ffc107'
                                    : '1px solid #ffc107'
                                  : isFocused
                                  ? '2px solid #1976d2'
                                  : '1px solid #e0e0e0',
                                backgroundColor: isInsertedRow
                                  ? isFocused
                                    ? '#fff8e1'
                                    : '#fffbf0'
                                  : isFocused
                                  ? '#e3f2fd'
                                  : 'white',
                              }}
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows" style={{ padding: '8px' }}>
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput
                              value={editedData?.expiryDate || ''}
                              onChange={(e) => updateEditingData(itemKey, 'expiryDate', e.target.value)}
                              onFocus={() => handleInputFocus(item?.documentItemId)}
                              type="date"
                              disabled={isProcessed}
                              style={{
                                border: isInsertedRow
                                  ? isFocused
                                    ? '2px solid #ffc107'
                                    : '1px solid #ffc107'
                                  : isFocused
                                  ? '2px solid #1976d2'
                                  : '1px solid #e0e0e0',
                                backgroundColor: isInsertedRow
                                  ? isFocused
                                    ? '#fff8e1'
                                    : '#fffbf0'
                                  : isFocused
                                  ? '#e3f2fd'
                                  : 'white',
                              }}
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Show delete button for inserted rows */}
                            {isInsertedRow && !isProcessed && (
                              <IconButton
                                size="small"
                                onClick={() => deleteInsertedRow(item?.documentItemId)}
                                style={{ color: '#f44336' }}
                                title="Delete this row"
                              >
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            )}

                            {/* Show cancel button for processed items */}
                            {isProcessed && originalProcessedStates.has(item?.documentItemId) && (
                              <IconButton
                                size="small"
                                onClick={() => handleCancelProcessedItem(item?.documentItemId)}
                                style={{ color: '#ff9800' }}
                                title="Cancel processing and restore original state"
                              >
                                <ArrowUturnDownIcon fontSize="small" />
                              </IconButton>
                            )}

                            {hasSuggestions && !isProcessed && !isInsertedRow && (
                              <div
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                              >
                                {/* Show API loading indicator */}
                                {isApiLoading && (
                                  <div style={{ fontSize: '10px', color: '#ff9800' }}>Searching CMS</div>
                                )}

                                {/* Show search status */}
                                {searchValue.trim() && !isApiLoading && (
                                  <div
                                    style={{
                                      fontSize: '10px',
                                      color: filteredSuggestions?.length > 0 ? '#4caf50' : '#f44336',
                                    }}
                                  >
                                    {filteredSuggestions?.length > 0
                                      ? `${filteredSuggestions?.length} matches`
                                      : 'No match'}
                                  </div>
                                )}

                                {(filteredSuggestions?.length > 1 ||
                                  (!searchValue.trim() && item?.suggestedCMSProductList?.length > 1)) && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      cursor: 'pointer',
                                      color: '#1976d2',
                                      fontSize: '12px',
                                    }}
                                    onClick={() => toggleRowExpansion(item?.documentItemId)}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`${isExpanded ? 'Hide' : 'Show'} additional suggestions`}
                                    onKeyDown={(e) => handleKeyDown(e, toggleRowExpansion, item?.documentItemId)}
                                  >
                                    <>
                                      {isExpanded ? (
                                        <ExpandLessIcon fontSize="small" />
                                      ) : (
                                        <ExpandMoreIcon fontSize="small" />
                                      )}
                                      <span>View {isExpanded ? 'less' : 'more'}</span>
                                    </>
                                  </div>
                                )}
                              </div>
                            )}
                            {!hasSuggestions && !isProcessed && !isApiLoading && !isInsertedRow && (
                              <SoftTypography variant="caption" color="textSecondary">
                                No suggestions
                              </SoftTypography>
                            )}
                            {isProcessed && (
                              <SoftTypography
                                variant="caption"
                                color="success"
                                style={{ marginLeft: '8px', alignItems: 'center' }}
                              >
                                {`Processed`}
                              </SoftTypography>
                            )}
                          </div>
                        </td>
                        <td className="express-grn-rows">
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                            {!isProcessed && (
                              <>
                                <input
                                  type="radio"
                                  checked={isSelected}
                                  onChange={(e) => handleItemSelection(item?.documentItemId, e.target.checked)}
                                />
                                <Tooltip title="Insert a new row here" placement="top">
                                  <IconButton
                                    size="small"
                                    onClick={() => insertNewRow(index)} // Pass index of the current row
                                    style={{ padding: '2px', color: '#1976d2' }}
                                  >
                                    <AddCircleOutline style={{ fontSize: '18px' }} />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>,
                    ];

                    // Add first suggestion row (best match) if available and not processed
                    if (!isProcessed && filteredSuggestions?.length > 0 && !isInsertedRow) {
                      const bestSuggestion = filteredSuggestions[0];
                      rows.push(
                        renderSuggestionRow(
                          item,
                          bestSuggestion,
                          1,
                          true, // isBestMatch
                          bestSuggestion?.similarityScore,
                        ),
                      );
                    }

                    // Show "No match found" message if searching but no results and API not loading
                    if (
                      !isProcessed &&
                      searchValue.trim() &&
                      filteredSuggestions?.length === 0 &&
                      !isApiLoading &&
                      !isInsertedRow
                    ) {
                      rows.push(
                        <tr key={`${item?.documentItemId}-no-match`} style={{ backgroundColor: '#fff3e0' }}>
                          <td colSpan="14" style={{ padding: '16px', textAlign: 'center' }}>
                            <SoftTypography variant="body2" color="warning">
                              No match found for "{searchValue}". CMS search completed.
                            </SoftTypography>
                          </td>
                        </tr>,
                      );
                    }

                    // Show API loading message
                    if (!isProcessed && isApiLoading && !isInsertedRow) {
                      rows.push(
                        <tr key={`${item?.documentItemId}-api-loading`} style={{ backgroundColor: '#f0f8f0' }}>
                          <td colSpan="14" style={{ padding: '16px', textAlign: 'center' }}>
                            <SoftTypography variant="body2" color="primary">
                              🔍 Searching CMS for "{searchValue}"
                            </SoftTypography>
                          </td>
                        </tr>,
                      );
                    }

                    // Add additional suggestion rows if expanded and not processed
                    if (isExpanded && !isProcessed && filteredSuggestions?.length > 1 && !isInsertedRow) {
                      filteredSuggestions?.slice(1)?.forEach((suggestion, suggestionIndex) => {
                        rows.push(
                          renderSuggestionRow(
                            item,
                            suggestion,
                            suggestionIndex + 2,
                            false, // isBestMatch
                            suggestion?.similarityScore,
                          ),
                        );
                      });
                    }

                    return <React.Fragment key={item?.documentItemId}>{rows}</React.Fragment>;
                  })}
                </tbody>
              </table>
            </div>
          </SoftBox>

          {/* Modal Footer Actions */}
          <div className="grn-ai-footer-section">
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <SoftTypography variant="body2">
                Total Items: <strong>{filteredDocumentAIItems?.length || 0}</strong>
              </SoftTypography>
              <SoftTypography variant="body2">
                Pending:{' '}
                <strong>
                  {filteredDocumentAIItems?.filter((item) => item?.status === 'SUGGESTION_PENDING')?.length || 0}
                </strong>
              </SoftTypography>
              <SoftTypography variant="body2">
                Processed:{' '}
                <strong>{filteredDocumentAIItems?.filter((item) => item?.status === 'PROCESSED')?.length || 0}</strong>
              </SoftTypography>
              <SoftTypography variant="body2">
                With Suggestions:{' '}
                <strong>
                  {filteredDocumentAIItems?.filter((item) => item?.suggestedCMSProductList?.length > 0)?.length || 0}
                </strong>
              </SoftTypography>
              <SoftTypography variant="body2">
                Selected: <strong>{selectedItems?.size + selectedSuggestions?.size}</strong>
              </SoftTypography>
              <SoftTypography variant="body2">
                Inserted Rows:{' '}
                <strong>{filteredDocumentAIItems?.filter((item) => item?.isInsertedRow)?.length || 0}</strong>
              </SoftTypography>
              <SoftTypography variant="body2">
                Total Amount: <strong>{TotalGrnValue}</strong>
              </SoftTypography>
              {focusedRow && (
                <SoftTypography variant="body2" style={{ color: '#1976d2', fontWeight: 'bold' }}>
                  Working on: Row{' '}
                  {filteredDocumentAIItems?.findIndex((item) => item?.documentItemId === focusedRow) + 1 || 0}
                </SoftTypography>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <SoftButton
                variant={buttonStyles.secondaryVariant}
                className="outlined-softbutton"
                onClick={() => {
                  onClose();
                  setIsModalLoading(false);
                }}
              >
                Cancel
              </SoftButton>
              <SoftButton
                variant={buttonStyles.primaryVariant}
                className="contained-softbutton vendor-add-btn"
                onClick={handleDoneClick}
                disabled={selectedItems?.size === 0 && selectedSuggestions?.size === 0}
              >
                Done ({selectedItems?.size + selectedSuggestions?.size})
              </SoftButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GRNDocumentAIModal;
