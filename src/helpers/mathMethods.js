const math = require('mathjs')

export const addFractions = (a, b)=> {
    const f1 = math.fraction(a)
    const f2 = math.fraction(b)
    return math.number(math.add(f1, f2))
}

export const multiplyFractions = (a,b) => {
    const f1 = math.fraction(a)
    const f2 = math.fraction(b)
    return math.number(math.multiply(f1, f2))
}