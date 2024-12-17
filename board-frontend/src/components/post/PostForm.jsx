import React, { useState, useCallback } from 'react'
import { TextField, Button, Box } from '@mui/material'

// 등록, 수정 폼 컴포넌트
const PostForm = ({ onSubmit, initialValues = {} }) => {
   const [imgUrl, setImgUrl] = useState('')
   const [imgFile, setImgFile] = useState(null) // 이미지 파일 객체
   const [content, setContent] = useState('') //게시물 내용
   const [hashtags, setHashtags] = useState('') //해시태그

   //이미지 파일 미리보기
   const handleImageChange = useCallback((e) => {
      //e.target.files 가 있으면 첫번째 파일 객체를 가져온다
      const file = e.target.files && e.target.files[0]
      if (!file) return // 파일이 없을 경우 함수 종료

      setImgFile(file) //업로드한 파일 객체를 state에 저장
      const reader = new FileReader()
      reader.readAsDataURL(file) //업로드한 파일을 Base64 URL로 변환(이미지 미리보기에 주로 사용)

      reader.onload = (event) => {
         setImgUrl(event.target.result)
      }
   }, [])

   //작성한 내용 전송
   const handleSubmit = useCallback(
      (e) => {
         e.preventDefault()

         if (!content.trim()) {
            alert('내용을 입력하세요.')
            return
         }

         if (!hashtags.trim()) {
            alert('해시태그를 입력하세요')
            return
         }

         if (!imgFile) {
            alert('이미지 파일을 추가하세요')
            return
         }

         const formData = new FormData()
         formData.append('content', content) // 게시물 내용 추가
         formData.append('hashtags', hashtags) // 해시태그 추가
         formData.append('img', imgFile) // 이미지 파일 추가

         onSubmit(formData) //formData 객체를 전송
      },
      [content, hashtags, imgFile, onSubmit]
   )

   return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} encType="multipart/form-data">
         {/* 이미지 업로드 필드 */}
         <Button variant="contained" component="label">
            이미지 업로드
            <input type="file" name="img" accept="image/*" hidden onChange={handleImageChange} />
         </Button>

         {imgUrl && (
            <Box mt={2}>
               <img src={imgUrl} alt="업로드 이미지 미리보기" style={{ width: '400px' }} />
            </Box>
         )}

         {/* 게시물 내용 입력 필드 */}
         <TextField label="게시물 내용" variant="outlined" fullWidth multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} sx={{ mt: 2 }} />

         {/* 해시태그 입력 필드 */}
         <TextField label="해시태그 (# 구분)" variant="outlined" fullWidth value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="예: #여행 #음식 #일상" sx={{ mt: 2 }} />

         {/* 등록 / 수정 버튼 */}
         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            {/* {submitButtonLabel} */}
            등록
         </Button>
      </Box>
   )
}

export default PostForm
