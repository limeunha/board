import { useParams } from 'react-router-dom'
import BoardForm from '../components/post/BoardForm'
import { Container } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoardByIdThunk, updateBoardThunk } from '../features/boardSlice'

const BoardEditPage = () => {
   const { id } = useParams() //post의 id
   const dispatch = useDispatch()
   const { board, loading, error } = useSelector((state) => state.boards)

   // 게시물 데이터 불러오기
   useEffect(() => {
      dispatch(fetchBoardByIdThunk(id))
      console.log(board)
   }, [dispatch, id])

   // 게시물 수정
   const handleSubmit = useCallback(
      (boardData) => {
         dispatch(updateBoardThunk({ id, boardData }))
            .unwrap()
            .then(() => {
               window.location.href = '/' //수정 후 메인페이지로 이동
            })
            .catch((error) => {
               console.error('게시물 수정 중 오류 발생:', error)
               alert('게시물 수정에 실패했습니다.', error)
            })
      },
      [dispatch, id]
   )

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러발생: {error}</p>

   return (
      <Container maxWidth="md">
         <h1>게시물 수정</h1>
         {board && <BoardForm onSubmit={handleSubmit} initialValues={board} />}
      </Container>
   )
}

export default BoardEditPage
