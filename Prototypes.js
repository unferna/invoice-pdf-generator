const Utils = require("./Utils")

String.prototype.isEmpty = function() {
    return this.trim().length == 0
}

String.prototype.lastCharacter = function() {
    if( this.isEmpty() ) {
        return undefined
    }

    return this.substring( this.length - 1, this.length )
}

Date.prototype.todayString = function() {
    const now = new Date()
    const dateArray = [
        Utils.addLeftZeroIfNeeded( now.getDate() ),
        Utils.addLeftZeroIfNeeded( now.getMonth() + 1 ),
        Utils.addLeftZeroIfNeeded( now.getFullYear() )
    ]

    return dateArray.join("/")
}

Date.prototype.basicToString = function() {
    const dateArray = [
        Utils.addLeftZeroIfNeeded( this.getDate() ),
        Utils.addLeftZeroIfNeeded( this.getMonth() + 1 ),
        Utils.addLeftZeroIfNeeded( this.getFullYear() )
    ]

    return dateArray.join("/")
}