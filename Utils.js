const range = (size, startAt = 0) => {
    return [ ...Array(size).keys() ].map(item => item + startAt)
}

module.exports = {
    addLeftZeroIfNeeded: number => {
        if( number < 0 && number > -10 ) {
            return `${number}`.replace("-", "-0")
        
        } else if ( number >= 0 && number < 10 ) {
            return `0${ number }`
        }
    
        return String(number)
    },
    validateUserInputDate: inputDate => {
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
        if( !dateRegex.test(inputDate) ) {
            return false
        }

        let numberOfDaysForMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

        const [dayString, monthString, yearString] = inputDate.split("/")
        const day = parseInt(dayString)
        const month = parseInt(monthString)
        const year = parseInt(yearString)
        
        if( year % 4 == 0 ) {
            numberOfDaysForMonths[1] = 29
        }

        const monthIndex = month - 1
        const maxNumberThatShouldBe = numberOfDaysForMonths[monthIndex]

        if( range( maxNumberThatShouldBe ).includes(day) ) {
            return true
        }
    },
    range
}