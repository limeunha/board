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

// API 응답 처리 함수 (중복 코드 제거)
const handleApiResponse = (response) => response.data

// API 에러 처리 함수 (중복 코드 제거)
const handleApiError = (error) => {
   const errorMessage = error.response?.data?.message || error.message || '알 수 없는 오류 발생'
   console.error(`API Request 오류: ${errorMessage}`)
   throw new Error(errorMessage)
}

// 회원가입
export const registerUser = async (userData) => {
   try {
      const response = await boardApi.post('/auth/join', userData)
      return handleApiResponse(response)
   } catch (error) {
      handleApiError(error)
   }
}

// 로그인
export const loginUser = async (credentials) => {
   try {
      const response = await boardApi.post('/auth/login', credentials)
      return handleApiResponse(response)
   } catch (error) {
      handleApiError(error)
   }
}

// 로그아웃
export const logoutUser = async () => {
   try {
      const response = await boardApi.get('/auth/logout')
      return handleApiResponse(response)
   } catch (error) {
      handleApiError(error)
   }
}

// 로그인 상태 확인
export const checkAuthStatus = async () => {
   try {
      const response = await boardApi.get('/auth/status')
      return handleApiResponse(response)
   } catch (error) {
      handleApiError(error)
   }
}

// 포스트 등록
export const createPost = async (postData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data', // 파일 전송시 반드시 지정
         },
      }
      const response = await boardApi.post('/post', postData, config)
      return handleApiResponse(response)
   } catch (error) {
      handleApiError(error)
   }
}

// 포스트 수정
export const updatePost = async (id, postData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data', // 파일 전송시 반드시 지정
         },
      }
      const response = await boardApi.put(`/post/${id}`, postData, config)
      return handleApiResponse(response)
   } catch (error) {
      handleApiError(error)
   }
}

// 포스트 삭제
export const deletePost = async (id) => {
   try {
      const response = await boardApi.delete(`/post/${id}`)
      return handleApiResponse(response)
   } catch (error) {
      handleApiError(error)
   }
}

// 특정 포스트 가져오기
export const getPostById = async (id) => {
   try {
      const response = await boardApi.get(`/post/${id}`)
      return handleApiResponse(response)
   } catch (error) {
      handleApiError(error)
   }
}

// 전체 포스트 가져오기 (페이징)
export const getPosts = async (page) => {
   try {
      const response = await boardApi.get(`/post?page=${page}`)
      return handleApiResponse(response)
   } catch (error) {
      handleApiError(error)
   }
}
