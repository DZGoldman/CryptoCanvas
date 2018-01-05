import React from 'react'
import ReactDOM from 'react-dom'
import * as  enc from '../helpers/encript'

test('left run tests', () => {
    expect(  enc.leftRun('') ) .toBe( '' )
    expect( enc.leftRun('11111')).toBe('a15a')
    expect( enc.leftRun('1233343')).toBe('1233343')
    expect (enc.leftRun('1000000000010000010')).toBe('1a010a1a05a10')

    console.log('asdfadsfs')
  });

  test('left run decrypt tests', () => {
    //   expect( enc.leftRunDecrypt('a15a')).toBe('11111')
      expect (enc.leftRunDecrypt('1a010a1a05a10')).toBe('1000000000010000010')
  })