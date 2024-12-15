import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { registerUser, loginUser, logoutUser } from '../api/snsApi'

/*
 rejectWithValue: 에러 메세지를 rejected에 action.payload로 전달할때 사용
 rejectWithValue 사용시 에러에 더 구체적인 내용을 담을 수 있음
*/

/*
 ?(optional chaining)

const error = { response: undefined }
console.log(error.response.data.message) // TypeError 발생! (Cannot read property 'data' of undefined)
console.log(error.response?.data?.message) // undefined 반환, 에러 없음
*/
// 회원가입 thunk
export const registerUserThunk = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
   try {
      /*
      {
        email: 'test@test.com',
        nick: '김하서',
        password: 11111
      }
    */
      const response = await registerUser(userData)
      return response.data.user
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '회원가입 실패')
   }
})

// 로그인 thunk
/*
credentials = {
    email: 'test@test.com',
    password: '1111'
}
*/
export const loginUserThunk = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
   try {
      const response = await loginUser(credentials)
      return response.data.user
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그인 실패')
   }
})

// 로그아웃 thunk
// _(언더바)는 매개변수 값이 없을 때 사용
export const logoutUserThunk = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
   try {
      const response = await logoutUser()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그아웃 실패')
   }
})

const authSlice = createSlice({
   name: 'auth',
   initialState: {
      // 서버에서 가져오는 데이터가 배열 일때만 [] 로 초기값을 주고 나머지는 null로 준다
      // null은 주로 문자열 혹은 json 객체 데이터 일때 사용
      user: null,
      isAuthenticated: false, //로그인 상태: 로그인이 되어있으면 true 그렇지 않으면 false
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      //회원가입
      builder
         .addCase(registerUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(registerUserThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
         })
         .addCase(registerUserThunk.rejected, (state, action) => {
            state.loading = true
            state.error = action.payload
         })
      //로그인
      builder
         .addCase(loginUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(loginUserThunk.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload
         })
         .addCase(loginUserThunk.rejected, (state, action) => {
            state.loading = true
            state.error = action.payload
         })
      //로그아웃
      builder
         .addCase(logoutUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(logoutUserThunk.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null //로그아웃 후 유저 정보 초기화
         })
         .addCase(logoutUserThunk.rejected, (state, action) => {
            state.loading = true
            state.error = action.payload
         })
   },
})

export default authSlice.reducer
