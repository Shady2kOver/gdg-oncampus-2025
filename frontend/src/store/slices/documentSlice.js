import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentDocument: null,
  bionicEnabled: false,
  boldPercentage: 50,
  documentContent: '',
};

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setCurrentDocument: (state, action) => {
      state.currentDocument = action.payload;
    },
    setBionicEnabled: (state, action) => {
      state.bionicEnabled = action.payload;
    },
    setBoldPercentage: (state, action) => {
      state.boldPercentage = action.payload;
    },
    setDocumentContent: (state, action) => {
      state.documentContent = action.payload;
    },
  },
});

export const {
  setCurrentDocument,
  setBionicEnabled,
  setBoldPercentage,
  setDocumentContent,
} = documentSlice.actions;

export default documentSlice.reducer; 