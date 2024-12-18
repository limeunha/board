import { Container } from '@mui/material'
import PostForm from '../components/post/PostForm'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { createBoardThunk } from '../features/boardSlice'

const PostCreatePage = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const handleSubmit = useCallback(
      (postData) => {
         dispatch(createBoardThunk(postData))
            .unwrap()
            .then(() => {
               navigate('/') //게시물 등록 후 메인페이지로 이동
            })
            .catch((error) => {
               console.error('게시물 등록 에러 : ', error)
               alert('게시물 등록에 실패했습니다.', error)
            })
      },
      [dispatch, navigate]
   )

   return (
      <Container maxWidth="md">
         <h1>게시물 등록</h1>
         <PostForm onSubmit={handleSubmit} />
      </Container>
   )
}

export default PostCreatePage
