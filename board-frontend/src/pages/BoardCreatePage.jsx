import { Container } from '@mui/material'
import BoardForm from '../components/post/BoardForm'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { createBoardThunk } from '../features/boardSlice'

const BoardCreatePage = () => {
   // const navigate = useNavigate()
   const dispatch = useDispatch()

   const handleSubmit = useCallback(
      (boardData) => {
         dispatch(createBoardThunk(boardData))
            .unwrap()
            .then(() => {
               //navigate('/') //게시물 등록 후 메인페이지로 이동
               window.location.href = '/' // 페이지 이동 => 전체 페이지 새로고침
            })
            .catch((error) => {
               console.error('게시물 등록 에러: ', error)
               alert('게시물 등록에 실패했습니다.', error)
            })
      },
      [dispatch]
   )

   return (
      <Container maxWidth="md">
         <h1>게시물 등록</h1>
         <BoardForm onSubmit={handleSubmit} />
      </Container>
   )
}

export default BoardCreatePage
