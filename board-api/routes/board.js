const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { Board, Hashtag, User } = require('../models') // Changed Post to Board
const { isLoggedIn } = require('./middlewares')
const router = express.Router()

// uploads 폴더가 없을 경우 새로 생성
try {
   fs.readdirSync('uploads') //해당 폴더가 있는지 확인
} catch (error) {
   console.log('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
   fs.mkdirSync('uploads') //폴더 생성
}

// 이미지 업로드를 위한 multer 설정
const upload = multer({
   // 저장할 위치와 파일명 지정
   storage: multer.diskStorage({
      destination(req, file, cb) {
         cb(null, 'uploads/') // uploads폴더에 저장
      },
      filename(req, file, cb) {
         const ext = path.extname(file.originalname) //파일 확장자 추출

         // 파일명 설정: 기존이름 + 업로드 날짜시간 + 확장자
         // dog.jpg
         // ex) dog + 1231342432443 + .jpg
         cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
      },
   }),
   // 파일의 크기 제한
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB로 제한
})

// 게시물 등록 localhost:8000/board
// <input type="file" name=img />
router.post('/', isLoggedIn, upload.single('img'), async (req, res) => {
   try {
      console.log('파일정보:', req.file)

      if (!req.file) {
         //업로드된 파일이 없거나 무언가 이상이 생겨서 파일 정보가 넘어오지 않는 경우
         return res.status(400).json({ success: false, message: '파일 업로드에 실패했습니다.' })
      }

      // 게시물 생성 (Board로 변경)
      const board = await Board.create({
         content: req.body.content, // 게시물 내용
         img: `/${req.file.filename}`, //이미지 url(파일명) => /dog1231342432443.jpg
         UserId: req.user.id, //작성자 id
      })

      // 게시물 내용에서 해시태그 추출
      const hashtags = req.body.hashtags.match(/#[^\s#]*/g) // #을 기준으로 해시태그 추출

      // 추출된 해시태그가 있으면
      if (hashtags) {
         //Promise.all: 여러개의 비동기 작업을 병렬로 처리. 모든 해시태그가 데이터 베이스에서 생성되거나 찾아질때까지 기다림
         const result = await Promise.all(
            hashtags.map((tag) =>
               Hashtag.findOrCreate({
                  where: { title: tag.slice(1) }, //#을 제외한 문자만
               })
            )
         )

         // boardhashtag 관계 테이블에 연결 데이터 추가
         await board.addHashtags(result.map((r) => r[0]))
      }

      res.json({
         success: true,
         board: {
            id: board.id,
            content: board.content,
            img: board.img,
            UserId: board.UserId,
         },
         message: '게시물이 성공적으로 등록되었습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물 등록 중 오류가 발생했습니다.', error })
   }
})

// 게시물 수정 localhost:8000/board/:id
router.put('/:id', isLoggedIn, upload.single('img'), async (req, res) => {
   try {
      // 게시물 존재 여부 확인 (Board로 변경)
      const board = await Board.findOne({ where: { id: req.params.id, UserId: req.user.id } })
      if (!board) {
         return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' })
      }

      // 게시물 수정
      await board.update({
         content: req.body.content, // 수정된 내용
         img: req.file ? `/${req.file.filename}` : board.img, // 수정된 이미지 파일이 있으면 교체 없으면 기존 값 유지
      })

      // 게시물에서 해시태그를 추출해서 존재하는 해시태그는 유지하고 새로운 해시태그를 넣어준다
      const hashtags = req.body.hashtags.match(/#[^\s#]*/g) // #을 기준으로 해시태그 추출
      if (hashtags) {
         const result = await Promise.all(
            hashtags.map((tag) =>
               Hashtag.findOrCreate({
                  where: { title: tag.slice(1) }, //#을 제외한 문자만
               })
            )
         )

         await board.addHashtags(result.map((r) => r[0])) // 기존 해시태그를 새 해시태그로 교체
      }

      // 업데이트된 게시물 다시 조회
      const updatedBoard = await Board.findOne({
         where: { id: req.params.id },
         include: [
            {
               model: User,
               attributes: ['id', 'nick'],
            },
            {
               model: Hashtag,
               attributes: ['title'],
            },
         ],
      })

      res.json({
         success: true,
         board: updatedBoard,
         message: '게시물이 성공적으로 수정되었습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물 수정 중 오류가 발생했습니다.', error })
   }
})

// 게시물 삭제 localhost:8000/board/:id
router.delete('/:id', isLoggedIn, async (req, res) => {
   try {
      // 삭제할 게시물 존재 여부 확인 (Board로 변경)
      const board = await Board.findOne({ where: { id: req.params.id, UserId: req.user.id } })
      if (!board) {
         return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' })
      }

      // 게시물 삭제
      await board.destroy()

      res.json({
         success: true,
         message: '게시물이 성공적으로 삭제되었습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물 삭제 중 오류가 발생했습니다.', error })
   }
})

// 특정 게시물 불러오기(id로 게시물 조회) localhost:8000/board/:id
router.get('/:id', async (req, res) => {
   try {
      const board = await Board.findOne({
         where: { id: req.params.id },
         include: [
            {
               model: User,
               attributes: ['id', 'nick'],
            },
            {
               model: Hashtag,
               attributes: ['title'],
            },
         ],
      })

      if (!board) {
         return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' })
      }

      res.json({
         success: true,
         board,
         message: '게시물을 성공적으로 불러왔습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물을 불러오는 중 오류가 발생했습니다.', error })
   }
})

// 전체 게시물 불러오기(페이징 기능) localhost:8000/board?page=1&limit=3
router.get('/', async (req, res) => {
   try {
      const page = parseInt(req.query.page, 10) || 1 // page번호(기본값: 1)
      const limit = parseInt(req.query.limit, 10) || 3 // 한페이지당 나타낼 게시물(레코드) 갯수(기본값: 3)
      const offset = (page - 1) * limit // 오프셋 계산

      const count = await Board.count() // Board로 변경

      const boards = await Board.findAll({
         limit,
         offset,
         order: [['createdAt', 'DESC']], // 최신날짜 순으로 가져온다
         include: [
            {
               model: User,
               attributes: ['id', 'nick', 'email'],
            },
            {
               model: Hashtag,
               attributes: ['title'],
            },
         ],
      })

      res.json({
         success: true,
         boards, // boards로 변경
         pagination: {
            totalBoards: count, // 전체 게시물 수
            currentPage: page, // 현재 페이지
            totalPages: Math.ceil(count / limit), // 총 페이지 수
            limit, // 페이지당 게시물 수
         },
         message: '전체 게시물 리스트를 성공적으로 불러왔습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물 리스트를 불러오는 중 오류가 발생했습니다.', error })
   }
})

module.exports = router
