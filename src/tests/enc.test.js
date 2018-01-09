import React from 'react'
import ReactDOM from 'react-dom'
import * as  enc from '../helpers/encript'



const randomNumStr = (limit=100)=> {
  const chars = '1234567890';
  var currentChar = chars[Math.floor(Math.random() * 10) + 0 ];
  var newStr = '' 
  var i = 0;
  while(newStr.length < limit){
    currentChar = chars[Math.floor(Math.random() * 10) + 0 ] 
    if (Math.random()>0.4){
      currentChar = currentChar.repeat(5)
    }
    newStr += currentChar
    i++
  }
  return newStr.slice(0,limit)
}

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

test('back rotate tests', () => {
  expect(  enc.backRotate('') ) .toBe( '' )
  expect(  enc.backRotate('147258369') ) .toBe( '123456789' )

});


test('rotate ole in & out tests', () => {
  const testHelper = (str) => {
    if (Math.random < 0.5){

      expect(str).toBe(enc.backRotate(enc.rotate(str)))
    } else {
      expect(str).toBe(enc.rotate(enc.backRotate(str)))

    }
  } 
  for (var i = 0; i < 25; i++) {
    testHelper(randomNumStr(i*i))
  }
});


  test('encript/decript tests', ()=>{
    const testHelper = (str) => {
      expect(str).toBe(enc.leftRunDecrypt(enc.leftRun(str)))
    } 
    for(var i = 0; i < 1000; i++){
      testHelper(randomNumStr())
    }
  })


  test('zoom vert tests', () => {
    expect (enc.zoomVertical('',2)).toBe('')
    expect (enc.zoomVertical('1111',1/2)).toBe('11')
    expect (enc.zoomVertical('1122112233443344',1/2)).toBe('11223344')
    expect (enc.zoomVertical('1234123412341234',1/4 )).toBe('1234')

    expect(enc.zoomVertical('1', 2)).toBe('11')
    expect(enc.zoomVertical('1', 9)).toBe('111111111')
    expect(enc.zoomVertical('1234', 3)).toBe('121212343434')
    expect(enc.zoomVertical('666616111',2)).toBe('666666616616111111')
    expect(enc.zoomVertical('9999',8)).toBe('9999'.repeat(8))
    expect(enc.zoomVertical('99999999'.repeat(8),1/8)).toBe('99999999')
    expect(enc.zoomVertical('8111',6)).toBe('818181818181111111111111')

  })
  test( 'zomm horrizontal tests', ()=>{
    expect(enc.zoomHorrizontal('',1)).toBe('')
    expect(enc.zoomHorrizontal('1',2)).toBe('11')
    expect(enc.zoomHorrizontal('123',2)).toBe('112233')
    expect(enc.zoomHorrizontal('222444',2)).toBe('222222444444')
    expect(enc.zoomHorrizontal('123',3)).toBe('111222333')
    expect(enc.zoomHorrizontal('12',5)).toBe('1111122222')
    expect(enc.zoomHorrizontal('1111',1/4)).toBe('1')

  })


  test( 'zomm tests', ()=> {
    expect(enc.zoom('',1)).toBe('')
    expect(enc.zoom('1111',1/2)).toBe('1')
    expect(enc.zoom('1',4)).toBe('1111111111111111')
    expect(enc.zoom('1122112233443344',1/2)).toBe('1234')

  })

  test('zoom ole in & out tests', ()=>{
    const testHelper = (str, scale, method) => {
      expect(method( method(str, scale), 1/scale)).toBe(str)
    } 

    testHelper('1515', 10, enc.zoom)
    testHelper('8111', 6, enc.zoom)
    for( var i = 0; i<50; i++){
      testHelper(
        randomNumStr(), Math.floor(Math.random() * 10) + 1,
        enc.zoomHorrizontal
      )
      testHelper(
        randomNumStr(), (Math.floor(Math.random() * 100) + 1),
        enc.zoom
      )

    }
  })