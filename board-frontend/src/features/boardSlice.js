import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createBoard, updateBoard, deleteBoard, getBoardById, getBoards } from '../api/boardApi'

// 게시물 등록 Thunk
export const createBoardThunk = createAsyncThunk('boards/createBoard', async (boardData, { rejectWithValue }) => {
   try {
      const response = await createBoard(boardData)
      return response // 게시물 등록 후 response를 반환합니다
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 등록 실패')
   }
})

// 게시물 수정
export const updateBoardThunk = createAsyncThunk('boards/updateboard', async (data, { rejectWithValue }) => {
   try {
      const { id, boardData } = data
      const response = await updateBoard(id, boardData)
      return response // 수정된 게시물을 반환합니다
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 수정 실패')
   }
})

// 게시물 삭제
export const deleteBoardThunk = createAsyncThunk('boards/deleteboard', async (id, { rejectWithValue }) => {
   try {
      const response = await deleteBoard(id)
      return id // 삭제된 게시물의 ID를 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 삭제 실패')
   }
})

// 특정 게시물 가져오기
export const fetchBoardByIdThunk = createAsyncThunk('boards/fetchBoardById', async (id, { rejectWithValue }) => {
   try {
      const response = await getBoardById(id)
      return response // 특정 게시물을 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 가져오기 실패')
   }
})

// 전체 게시물 리스트 가져오기
export const fetchBoardsThunk = createAsyncThunk('boards/fetchboards', async (page, { rejectWithValue }) => {
   try {
      const response = await getBoards(page)
      return response // 전체 게시물 리스트 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 리스트 불러오기 실패')
   }
})

const boardSlice = createSlice({
   name: 'boards',
   initialState: {
      boards: [],
      post: null,
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
            state.posts = [...state.posts, action.payload] // 새 게시물을 리스트에 추가
         })
         .addCase(createBoardThunk.rejected, (state, action) => {
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
            // 수정된 게시물 업데이트
            state.posts = state.posts.map((post) => (post.id === action.payload.id ? action.payload : post))
         })
         .addCase(updateBoardThunk.rejected, (state, action) => {
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
            // 삭제된 게시물을 리스트에서 제거
            state.posts = state.posts.filter((post) => post.id !== action.payload)
         })
         .addCase(deleteBoardThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 게시물 가져오기
      builder
         .addCase(fetchBoardByIdThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchBoardByIdThunk.fulfilled, (state, action) => {
            state.loading = false
            state.post = action.payload // 특정 게시물을 상태에 저장
         })
         .addCase(fetchBoardByIdThunk.rejected, (state, action) => {
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
            state.posts = action.payload.posts
            state.pagination = action.payload.pagination
         })
         .addCase(fetchBoardsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default boardSlice.reducer
