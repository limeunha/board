import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL

const boardApi = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true,
})

// 회원가입
export const registerUser = async (userData) => {
   try {
      const response = await boardApi.post('/auth/join', userData)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.response ? error.response.status : error.message}`)
      throw error
   }
}

// 로그인
export const loginUser = async (credentials) => {
   try {
      const response = await boardApi.post('/auth/login', credentials)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.response ? error.response.status : error.message}`)
      throw error
   }
}

// 로그아웃
export const logoutUser = async () => {
   try {
      const response = await boardApi.get('/auth/logout')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.response ? error.response.status : error.message}`)
      throw error
   }
}

// 로그인 상태 확인
export const checkAuthStatus = async () => {
   try {
      const response = await boardApi.get('/auth/status')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.response ? error.response.status : error.message}`)
      throw error
   }
}

// 포스트 등록
export const createBoard = async (boardData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }

      const response = await boardApi.post('/board', boardData, config)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.response ? error.response.status : error.message}`)
      throw error
   }
}

// 포스트 수정
export const updateBoard = async (id, boardData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }

      const response = await boardApi.put(`/board/${id}`, boardData, config)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.response ? error.response.status : error.message}`)
      throw error
   }
}

// 포스트 삭제
export const deleteBoard = async (id) => {
   try {
      const response = await boardApi.delete(`/board/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.response ? error.response.status : error.message}`)
      throw error
   }
}

// 특정 포스트 가져오기
export const getBoardById = async (id) => {
   try {
      const response = await boardApi.get(`/board/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.response ? error.response.status : error.message}`)
      throw error
   }
}

// 전체 포스트 가져오기(페이징)
export const getBoards = async (page) => {
   try {
      const response = await boardApi.get(`/board?page=${page}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.response ? error.response.status : error.message}`)
      throw error
   }
}
