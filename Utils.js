module.exports = {
    addLeftZeroIfNeeded: number => {
        if( number < 0 && number > -10 ) {
            return `${number}`.replace("-", "-0")
        
        } else if ( number >= 0 && number < 10 ) {
            return `0${ number }`
        }
    
        return String(number)
    }
}