import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createBoard, updateBoard, deleteBoard, getBoardById, getBoards } from '../api/boardApi'

// 게시물 등록 Thunk
export const createBoardThunk = createAsyncThunk('boards/createBoard', async (boardData, { rejectWithValue }) => {
   try {
      const response = await createBoard(boardData)
      return response.data.board // 게시물 등록 후 response를 반환합니다
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 등록 실패')
   }
})

// 게시물 수정
export const updateBoardThunk = createAsyncThunk('boards/updateBoard', async (data, { rejectWithValue }) => {
   try {
      const { id, boardData } = data
      const response = await updateBoard(id, boardData)
      return response.data.board
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 수정 실패')
   }
})

// 게시물 삭제
export const deleteBoardThunk = createAsyncThunk('boards/deleteBoard', async (id, { rejectWithValue }) => {
   try {
      const response = await deleteBoard(id)
      return id
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 삭제 실패')
   }
})

// 특정 게시물 가져오기
export const fetchBoardByIdThunk = createAsyncThunk('boards/fetchBoardById', async (id, { rejectWithValue }) => {
   try {
      const response = await getBoardById(id)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 불러오기 실패')
   }
})

// 전체 게시물 리스트 가져오기
export const fetchBoardsThunk = createAsyncThunk('boards/fetchboards', async (page, { rejectWithValue }) => {
   try {
      const response = await getBoards(page)
      return response.data // 전체 게시물 리스트 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 리스트 불러오기 실패')
   }
})

const boardSlice = createSlice({
   name: 'boards',
   initialState: {
      boards: [],
      board: null,
      pagination: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 게시물 등록
      builder
         .addCase(createBoardThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createBoardThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(createBoardThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 게시물 리스트 불러오기
      builder
         .addCase(fetchBoardsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchBoardsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.boards = action.payload.boards
            state.pagination = action.payload.pagination
         })
         .addCase(fetchBoardsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      // 특정 게시물 불러오기
      builder
         .addCase(fetchBoardByIdThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchBoardByIdThunk.fulfilled, (state, action) => {
            state.loading = false
            state.board = action.payload.board
         })
         .addCase(fetchBoardByIdThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 게시물 삭제
      builder
         .addCase(deleteBoardThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteBoardThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(deleteBoardThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 게시물 수정
      builder
         .addCase(updateBoardThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateBoardThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(updateBoardThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default boardSlice.reducer
