// src/components/Navbar.js

import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material'
import CreateIcon from '@mui/icons-material/Create'
import { Link, useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { logoutUserThunk } from '../../features/authSlice'

const Navbar = ({ isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const handleLogout = useCallback(() => {
      dispatch(logoutUserThunk())
         .unwrap()
         .then(() => {
            navigate('/') // 로그아웃 후 메인 페이지로 이동
         })
         .catch((error) => {
            console.error('로그아웃 실패:', error)
            alert('로그아웃 중 문제가 발생했습니다.')
         })
   }, [dispatch, navigate])

   return (
      <AppBar position="static" style={{ backgroundColor: '#fff' }}>
         <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
               <Link to="/">
                  <img src="/images/logo.png" alt="로고" width="160" style={{ display: 'inline-block', marginTop: '15px' }} />
               </Link>
            </Typography>

            {isAuthenticated ? (
               <>
                  <Link to="/posts/create">
                     <IconButton aria-label="글쓰기">
                        <CreateIcon />
                     </IconButton>
                  </Link>
                  <Link to="/my" style={{ textDecoration: 'none' }}>
                     <Typography variant="body1" style={{ marginRight: '20px', color: 'black' }}>
                        {user?.nick}님
                     </Typography>
                  </Link>
                  <Button onClick={handleLogout} variant="outlined">
                     로그아웃
                  </Button>
               </>
            ) : (
               <Link to="/login">
                  <Button variant="contained">로그인</Button>
               </Link>
            )}
         </Toolbar>
      </AppBar>
   )
}

export default Navbar
