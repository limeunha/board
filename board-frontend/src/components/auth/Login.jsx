import React, { useState, useMemo, useCallback } from 'react'
import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUserThunk } from '../../features/authSlice'

const Login = () => {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { loading, error } = useSelector((state) => state.auth)

   const handleLogin = useCallback(
      (e) => {
         e.preventDefault()
         if (email.trim() && password.trim()) {
            dispatch(loginUserThunk({ email, password }))
               .unwrap()
               .then(() => {
                  navigate('/')
               })
               .catch((err) => {
                  console.error('로그인 실패:', err)
               })
         } else {
            console.error('이메일과 비밀번호를 모두 입력해주세요!')
         }
      },
      [dispatch, email, password, navigate]
   )

   const loginButtonContent = useMemo(
      () =>
         loading ? (
            <CircularProgress
               size={24}
               sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
               }}
            />
         ) : (
            '로그인'
         ),
      [loading]
   )

   return (
      <Container maxWidth="sm">
         <Typography variant="h4" gutterBottom>
            로그인
         </Typography>

         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}

         <form onSubmit={handleLogin}>
            <TextField label="이메일" name="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />

            <TextField label="비밀번호" type="password" name="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading} sx={{ position: 'relative', marginTop: '20px' }}>
               {loginButtonContent}
            </Button>
         </form>

         <p>
            계정이 없으신가요? <Link to="/signup">회원가입</Link>
         </p>
      </Container>
   )
}

export default Login
