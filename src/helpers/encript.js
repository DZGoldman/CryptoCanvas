import {addFractions, multiplyFractions} from './mathMethods'


export const numToRbga = [ '0,0,0,0', // blank
                    '224,28,11,1', //red
                    '13,222,131,1', //green
                    '13,142,222,1', //blue
                    '220,220,80,255',
                    '224,11,149,1',
                    '0,0,0,1',
                    '199,106,0,1'
                ]

export const numToRbgaFull = numToRbga.map((c)=>`rgba(${c})`)

const rgbaToNum = {}
for (var i = 0; i < numToRbga.length; i++){
    rgbaToNum[numToRbga[i]] = i
}

export const clampedArrToNumArr = (campedArr) => {
    var segment;
    var numString = ''
    for (var i = 0; i < campedArr.length; i+= 4){
        segment = campedArr.slice(i, i +4)
        numString += rgbaToNum[segment]
    }
    return numString
}


export const leftRunWithLines =  (numStr, delin='b') =>{
    const stringsArray = [];
    const width = Math.sqrt(numStr.length);
    var finalStr='';
    for (var i = 0; i < numStr.length; i += width ) {
        stringsArray .push(numStr.slice(i, i+ width))
    }
    const leftRunArray = stringsArray.map((str)=> leftRun(str))
    var currentStr, currentCount= 1;
    for (var i=0; i < leftRunArray.length ; i++){
        currentStr = leftRunArray[i]
        if (currentStr === leftRunArray[i+1]) {
            currentCount++
        } else {
            
            if (currentCount < 2){
                finalStr += currentStr
            } else {
                finalStr += delin + currentStr + delin +  currentCount + delin
            }
            currentCount = 1
        }
    }
    return finalStr
} 
// 90 deg
export const rotate = (numStr) => {
    var newString = '';
    var currentIndex;
    // TODO: ensure integer
    const width = Math.sqrt(numStr.length)
    for (var i = 0; i < width; i ++ ){
        for (var j = 0; j < width; j ++ ){
            currentIndex = i + j * width
            newString += numStr[currentIndex]
        }
    }
    return newString
}

export const backRotate = (numStr) =>{
    const width = Math.sqrt(numStr.length);
    var newStr = '';
    for (var i = 0; i < width; i ++ ){ 
        for (var j = 0; j < width; j++ ){ 
            newStr += numStr[width * j  + i] 
        }

    }
    return newStr
}

export const leftRun=  (numStr, delin='a') => {
    var currentCount = 1, currentChar = '', finalStr='';

    for (var i=0; i < numStr.length ; i++){
        currentChar = numStr[i]
        if (currentChar === numStr[i+1]) {
            currentCount++
        } else {
            
            if (currentCount < 4){
                finalStr += currentChar.repeat( currentCount)
            } else {
                finalStr += delin + currentChar + currentCount + delin
            }
            currentCount = 1
        }
    }
    return finalStr
}


export  const leftRunSequeceToFull = (seq)=> {
    return seq[0].repeat(seq.slice(1))
}

export const leftRunDecrypt = (encryptedStr, delin='a') => {
    var decryptedString = '',
    currentChar='',
    len = encryptedStr.length,
    nextDelinIndex,
    newRun
    for(var i = 0; i < len; i++) {
        currentChar = encryptedStr[i];
        if (currentChar == delin) {
            nextDelinIndex= i+1;
            while (nextDelinIndex < len && encryptedStr[nextDelinIndex] != delin){
                nextDelinIndex ++
            }
            decryptedString+= leftRunSequeceToFull( encryptedStr.slice(i+1, nextDelinIndex))
            i = nextDelinIndex

        } else {
            decryptedString += currentChar
        }

    } 
        return decryptedString
}

export const zoomVertical = (numString, scale=1 ) => {
   const stringRows = [];
   const height = Math.sqrt(numString.length);
   var newStr='',
   segment;
   for (var i = 0; i < numString.length; i+= height) {
        segment = numString.slice(i, i + height)
        stringRows.push(segment)
    }
    for (var i = 0; i < stringRows.length;   i=   addFractions(i , 1/scale)) {
        newStr += stringRows[Math.floor(i )]
    }
    return newStr

}

export const zoomHorrizontal = (numStr, scale) => {
    var currentRunChar=numStr[0],
    currentRunCount=1,
    newStr='';
    numStr.split('').forEach((char, i)=>{
        if (char == numStr[i+1]){
            currentRunCount++
        } else {
            newStr += char.repeat( multiplyFractions(currentRunCount ,scale))
            currentRunCount = 1
        }
    })
    return newStr
}

export const zoom = (numStr, scale) => {
    return zoomHorrizontal (
        zoomVertical(numStr, scale), scale
    )
}


export const encryptMain = (numStr) => {
    const leftRan = leftRun(numStr);
    const leftRanRotated = leftRun(rotate(numStr))

    if ( leftRanRotated.length < leftRan.length ){
        return '2' + leftRanRotated
    } else {
        return '1' + leftRan
    }
}

export const decryptMain = (numStr) => {
    if (!numStr.length) return ''
    const data = numStr.slice(1)
    switch (numStr[0]) {
        case '2':
            return backRotate(leftRunDecrypt(data))
        case '1':
            return leftRunDecrypt(data)
        default:
            return false;
    }
}

