import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import boardReducer from '../features/boardSlice'
import pageReducer from '../features/pageSlice'
import userReducer from '../features/userSlice'

const store = configureStore({
   reducer: {
      auth: authReducer,
      boards: boardReducer,
      page: pageReducer,
      user: userReducer,
   },
})

export default store
