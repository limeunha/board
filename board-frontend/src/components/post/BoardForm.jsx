import React, { useState, useCallback, useMemo } from 'react'
import { TextField, Button, Box } from '@mui/material'

// 등록, 수정 폼 컴포넌트
const BoardForm = ({ onSubmit, initialValues = {} }) => {
   const [imgUrl, setImgUrl] = useState(initialValues.img ? process.env.REACT_APP_API_URL + initialValues.img : '') // 이미지 경로(파일명 포함)
   const [imgFile, setImgFile] = useState(null) // 이미지 파일 객체
   const [content, setContent] = useState(initialValues.content || '') //게시물 내용
   const [hashtags, setHashtags] = useState(
      initialValues.Hashtags
         ? initialValues.Hashtags.map((tag) => `#${tag.title}`).join(' ') //해시태그 문자열을 만들어줌
         : ''
   )
   const handleImageChange = useCallback((e) => {
      const file = e.target.files && e.target.files[0]
      if (!file) return

      setImgFile(file)

      const reader = new FileReader()

      reader.readAsDataURL(file)

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
            alert('해시태그를 입력하세요.')
            return
         }

         if (!imgFile && !initialValues.id) {
            alert('이미지 파일을 추가하세요.')
            return
         }

         const formData = new FormData() //폼 데이터를 쉽게 생성하고 전송할 수 있도록 하는 객체
         formData.append('content', content) //게시물 내용 추가
         formData.append('hashtags', hashtags) //해시태그 추가

         // 내용만 수정할때 에러 방지
         if (imgFile) {
            // 파일명 인코딩(한글 파일명 깨짐 방지)
            const encodedFile = new File([imgFile], encodeURIComponent(imgFile.name), { type: imgFile.type })

            formData.append('img', encodedFile) //이미지 파일 추가
         }

         //등록할때는 PostCreatePage.jsx 의 handleSubmit() 함수를 실행시킴
         //수정할때는 PostEditPage.jsx 의 handleSubmit() 함수를 실행시킴
         onSubmit(formData) //formData 객체를 전송
      },
      [content, hashtags, imgFile, onSubmit]
   )

   // state 변경시 등록/수정 버튼 재연산 방지
   const submitButtonLabel = useMemo(() => (initialValues.id ? '수정하기' : '등록하기'), [initialValues.id])

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
            {submitButtonLabel}
         </Button>
      </Box>
   )
}

export default BoardForm
