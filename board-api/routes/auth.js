const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user') //const {User} = require('../models')

const router = express.Router()

//회원가입 : localhost:8000/auth/join
router.post('/join', async (req, res, next) => {
   const { email, nick, password } = req.body
   try {
      //이메일로 기존 사용자 검색
      //select * from users where email = ?
      const exUser = await User.findOne({ where: { email } })

      if (exUser) {
         //이미 사용자가 존재할 경우 409 상태코드와 메세지를 json객체로 응답하면서 함수를 끝냄
         return res.status(409).json({
            success: false,
            message: '이미 존재하는 사용자입니다.',
         })
      }
      //이메일 중복 확인을 통과시 새로운 사용자 계정 생성

      //비밀번호 암호화
      const hash = await bcrypt.hash(password, 12) //12 : salt(해시 암호화를 진행시 추가되는 임의의 데이터로 10~12 정도의 값이 권장)

      //새로운 사용자 생성
      const newUser = await User.create({
         email,
         nick,
         password: hash,
      })

      // 성공 응답 반환
      res.status(201).json({
         success: true,
         message: '사용자가 성공적으로 등록되었습니다.',
         user: {
            id: newUser.id,
            email: newUser.email,
            nick: newUser.nick,
         }, //create한 데이터 반환
      })
   } catch (error) {
      //try문 어딘가에서 에러가 발생하면 500상태 코드와 json 객체 응답
      console.error(err)
      res.status(500).json({
         success: false,
         message: '회원가입 중 오류가 발생했습니다.',
         error,
      })
   }
})

//로그인 : localhost:8000/auth/login
router.post('/login', async (req, res, next) => {})

//로그아웃 : localhost:8000/auth/logout
router.post('/logout', async (req, res, next) => {})

//로그인 상태 확인 : localhost:8000/auth/status
router.post('/status', async (req, res, next) => {})

module.exports = router
