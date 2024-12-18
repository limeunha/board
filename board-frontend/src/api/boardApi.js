import axios from 'axios'

// 환경 변수로 지정된 기본 URL 사용
const BASE_URL = process.env.REACT_APP_API_URL

// axios 인스턴스 생성
const boardApi = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true,
})

// API 응답 처리 함수
const handleApiResponse = (response) => response.data

// API 에러 처리 함수
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

// 보드 등록
export const createBoard = async (boardData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }
      const response = await boardApi.post('/board', boardData, config)
      return handleApiResponse(response)
   } catch (error) {
      handleApiError(error)
   }
}

// 보드 수정
export const updateBoard = async (id, boardData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }
      const response = await boardApi.put(`/board/${id}`, boardData, config)
      return handleApiResponse(response)
   } catch (error) {
      handleApiError(error)
   }
}

// 보드 삭제
export const deleteBoard = async (id) => {
   try {
      const response = await boardApi.delete(`/board/${id}`)
      return handleApiResponse(response)
   } catch (error) {
      handleApiError(error)
   }
}

// 특정 보드 가져오기
export const getBoardById = async (id) => {
   try {
      const response = await boardApi.get(`/board/${id}`)
      return handleApiResponse(response)
   } catch (error) {
      handleApiError(error)
   }
}

// 전체 보드 가져오기 (페이징)
export const getBoards = async (page) => {
   try {
      const response = await boardApi.get(`/boards?page=${page}`)
      return handleApiResponse(response)
   } catch (error) {
      handleApiError(error)
   }
}
