import React from 'react'
import ReactDOM from 'react-dom'
import * as  enc from '../helpers/encript'

test('left run tests', () => {
    expect(  enc.leftRun('') ) .toBe( '' )
    expect( enc.leftRun('11111')).toBe('a15a')
    expect( enc.leftRun('1233343')).toBe('1233343')
    expect (enc.leftRun('1000000000010000010')).toBe('1a010a1a05a10')
  });

test('left run decrypt tests', () => {
  expect( enc.leftRunDecrypt('')).toBe('')
  expect( enc.leftRunDecrypt('a15a')).toBe('11111')
  expect (enc.leftRunDecrypt('1a010a1a05a10')).toBe('1000000000010000010')
})


test('rotate tests', () => {
  expect(  enc.rotate('') ) .toBe( '' )
  expect(  enc.rotate('1234') ) .toBe( '1324' )
  expect(  enc.rotate('123456789') ) .toBe( '147258369' )
});


  test('encript/decript tests', ()=>{
    const testHelper = (str) => {
      expect(str).toBe(enc.leftRunDecrypt(enc.leftRun(str)))
    } 
  
    const randomNumStr = ()=> {
      const chars = '1234567890';
      var currentChar = chars[Math.floor(Math.random() * 10) + 0 ];
      var newStr = '' 
      for(var i = 0; i < 100; i++){
        currentChar = chars[Math.floor(Math.random() * 10) + 0 ] 
        if (Math.random()>0.4){
          currentChar = currentChar.repeat(5)
        }
        newStr += currentChar
      }
      return newStr
    }
  
    for(var i = 0; i < 1000; i++){
      testHelper(randomNumStr())
    }
  })


  // test('zoom tests', () => {
  //   //   expect( enc.leftRunDecrypt('a15a')).toBe('11111')
  //   expect (enc.zoomVertical('',2)).toBe('')
  //   // expect (enc.zoomVertical('1111',2)).toBe('11')
  //   expect (enc.zoomVertical('1122112233443344',2)).toBe('11223344')
  //   expect('123456789', 1/3).toBe('123123123456456456789789789')
  // })
