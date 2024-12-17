import { createSlice } from '@reduxjs/toolkit'

const pageSlice = createSlice({
   name: 'page',
   initialState: {
      user: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {},
})

export default pageSlice.reducer
