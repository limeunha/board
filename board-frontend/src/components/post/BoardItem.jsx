import { Card, CardMedia, CardContent, Typography, Box, CardActions, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs' //날짜 시간 포맷해주는 패키지
import { useCallback } from 'react'
import { deleteBoardThunk } from '../../features/boardSlice'

const PostItem = ({ post, isAuthenticated, user }) => {
   const dispatch = useDispatch()

   //게시물 삭제 실행
   const onClickDelete = useCallback(
      (id) => {
         dispatch(deleteBoardThunk(id))
            .unwrap()
            .then(() => {
               // navigate('/') => spa방식
               window.location.href = '/' // 페이지 이동 => 전체 페이지 새로고침
            })
            .catch((error) => {
               console.error('게시물 삭제 중 오류 발생: ', error)
               alert('게시물 삭제에 실패했습니다', error)
            })
      },
      [dispatch]
   )

   return (
      <Card style={{ margin: '20px 0' }}>
         <CardMedia sx={{ height: 240 }} image={`${process.env.REACT_APP_API_URL}${post.img}`} title={post.content} />
         <CardContent>
            <Link to={`/my/${post.User.id}`} style={{ textDecoration: 'none' }}>
               <Typography sx={{ color: 'primary.main' }}>@{post.User.nick} </Typography>
            </Link>
            <Typography>{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            <Typography>{post.content}</Typography>
         </CardContent>
         <CardActions>
            <Button size="small" color="primary">
               <FavoriteBorderIcon fontSize="small" />
            </Button>
            {isAuthenticated && post.User.id === user.id && (
               <Box sx={{ p: 2 }}>
                  <Link to={`/posts/edit/${post.id}`}>
                     <IconButton aria-label="edit" size="small">
                        <EditIcon fontSize="small" />
                     </IconButton>
                  </Link>
                  <IconButton aria-label="delete" size="small" onClick={() => onClickDelete(post.id)}>
                     <DeleteIcon fontSize="small" />
                  </IconButton>
               </Box>
            )}
         </CardActions>
      </Card>
   )
}

export default PostItem
