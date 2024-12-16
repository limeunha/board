import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL

// axios 인스턴스 생성
const boardApi = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true, // 세션 쿠키를 요청에 포함
})

// 회원가입
export const registerUser = async (userData) => {
   try {
      const response = await boardApi.post('/auth/join', userData)
      return response
   } catch (error) {
      const errorMessage = error.response?.data?.message || '알 수 없는 오류 발생'
      console.error(`API Request 오류: ${errorMessage}`)
      throw new Error(errorMessage)
   }
}

// 로그인
export const loginUser = async (credentials) => {
   try {
      const response = await boardApi.post('/auth/login', credentials)
      return response
   } catch (error) {
      const errorMessage = error.response?.data?.message || '알 수 없는 오류 발생'
      console.error(`API Request 오류: ${errorMessage}`)
      throw new Error(errorMessage)
   }
}

// 로그아웃
export const logoutUser = async () => {
   try {
      const response = await boardApi.get('/auth/logout')
      return response
   } catch (error) {
      const errorMessage = error.response?.data?.message || '알 수 없는 오류 발생'
      console.error(`API Request 오류: ${errorMessage}`)
      throw new Error(errorMessage)
   }
}

// 로그인 상태 확인
export const checkAuthStatus = async () => {
   try {
      const response = await boardApi.get('/auth/status')
      return response
   } catch (error) {
      const errorMessage = error.response?.data?.message || '알 수 없는 오류 발생'
      console.error(`API Request 오류: ${errorMessage}`)
      throw new Error(errorMessage)
   }
}
