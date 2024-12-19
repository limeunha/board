import { useParams } from 'react-router-dom' // useParams 임포트
import { useDispatch, useSelector } from 'react-redux' // useDispatch, useSelector 임포트
import { useEffect, useCallback } from 'react' // useEffect, useCallback 임포트
import { fetchBoardByIdThunk, updateBoardThunk } from '../features/boardSlice' // thunk 액션 임포트
import { Container } from '@mui/material' // MUI Container 임포트
import BoardForm from '../components/post/BoardForm' // BoardForm 컴포넌트 임포트
import { useNavigate } from 'react-router-dom' // useNavigate 임포트

const BoardEditPage = () => {
   const navigate = useNavigate() // navigate 훅 추가
   const { id } = useParams() // 게시물의 id
   const dispatch = useDispatch()
   const { post, loading, error } = useSelector((state) => state.boards)

   // 게시물 데이터 불러오기
   useEffect(() => {
      dispatch(fetchBoardByIdThunk(id))
   }, [dispatch, id])

   // 게시물 수정
   const handleSubmit = useCallback(
      (postData) => {
         dispatch(updateBoardThunk({ id, postData }))
            .unwrap()
            .then(() => {
               navigate('/') // 수정 후 메인 페이지로 이동
            })
            .catch((error) => {
               console.error('게시물 수정 중 오류 발생:', error)
               alert(error.response?.data?.message || '게시물 수정에 실패했습니다.')
            })
      },
      [dispatch, id, navigate] // navigate를 의존성 배열에 추가
   )

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러 발생: {error}</p>

   return (
      <Container maxWidth="md">
         <h1>게시물 수정</h1>
         {post && <BoardForm onSubmit={handleSubmit} initialValues={post} />}
      </Container>
   )
}

export default BoardEditPage
