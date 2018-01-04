

export const numToRbga = [ '0,0,0,0', // blank
                    '255,0,0,255', //red
                    '0,255,0,255', //green
                    '0,0,255,255' //blue
                ]

const rgbaToNum = {}
for (var i = 0; i < numToRbga.length; i++){
    rgbaToNum[numToRbga[i]] = i
}

export const clampedArrToNumArr = (campedArr) => {
    var segment;
    var numString = ''
    for (var i = 0; i < campedArr.length; i+= 4){
        segment = String(campedArr.slice(i, i +4))
        // console.log(segment)
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
console.log('????')
console.log(leftRunWithLines('111111111'))