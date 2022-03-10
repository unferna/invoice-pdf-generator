String.prototype.isEmpty = function() {
    return this.trim().length == 0
}

String.prototype.lastCharacter = function() {
    if( this.isEmpty() ) {
        return undefined
    }

    return this.substring( this.length - 1, this.length )
}