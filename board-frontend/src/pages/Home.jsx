import { Container, Typography, Pagination, Stack, CircularProgress } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostsThunk } from '../features/boardSlice'
import PostItem from '../components/post/PostItem'

const Home = ({ isAuthenticated, user }) => {
   const [page, setPage] = useState(1) // 현재 페이지
   const dispatch = useDispatch()
   const { boards, pagination, loading, error } = useSelector((state) => state.boards)

   useEffect(() => {
      dispatch(fetchPostsThunk(page))
   }, [dispatch, page])

   // 페이지 변경
   const handlePageChange = useCallback((event, value) => {
      setPage(value)
   }, [])

   return (
      <Container maxWidth="md">
         <Typography variant="h4" align="center" gutterBottom>
            Home Feed
         </Typography>

         {loading ? (
            <Stack spacing={2} direction="row" justifyContent="center" sx={{ mt: 3 }}>
               <CircularProgress />
               <Typography variant="body1">로딩 중...</Typography>
            </Stack>
         ) : error ? (
            <Typography variant="body1" align="center" color="error">
               에러 발생: {error}
            </Typography>
         ) : boards.length > 0 ? (
            <>
               {boards.map((post) => (
                  <PostItem key={post.id} post={post} isAuthenticated={isAuthenticated} user={user} />
               ))}
               <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                  <Pagination
                     count={pagination.totalPages} // 총 페이지수
                     page={page} // 현재 페이지
                     onChange={handlePageChange} // 페이지를 변경할 함수
                  />
               </Stack>
            </>
         ) : (
            <Typography variant="body1" align="center">
               게시물이 없습니다.
            </Typography>
         )}
      </Container>
   )
}

export default Home
