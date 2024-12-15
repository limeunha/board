import axios from 'axios'

//애플리케이션이 실행될때 환경변수들의 값을 가져오는 방법
const BASE_URL = process.env.REACT_APP_API_URL

//axios 인스턴스 생성
const boardApi = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true, //보안인증
})

//회원가입
export const registerUser = async (userData) => {
   try {
      const response = await boardApi.post('/auth/join', userData)
      return response
   } catch (error) {
      console.error(`API Request 오류 : ${error.message}`)
      throw error
   }
}

//로그인
export const loginUser = async (Credential) => {
   try {
      const response = await snsApi.post('/auth/login', Credential)
      return response
   } catch (error) {
      console.error(`API Request 오류 : ${error.message}`)
      throw error // request할 때 오류 발생시 에러를 registerUser() 함수를 실행한 곳으로 던짐
   }
}

//로그아웃
export const logoutUser = async () => {
   try {
      const response = await snsApi.get('/auth/logout')
      return response
   } catch (error) {
      console.error(`API Request 오류 : ${error.message}`)
      throw error // request할 때 오류 발생시 에러를 registerUser() 함수를 실행한 곳으로 던짐
   }
}