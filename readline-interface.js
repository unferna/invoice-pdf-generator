const readline = require("readline")
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const cliColors = require("./cli-colors")

class UserInput {
    async input(prompt, color) {
        const nothingCriteria = [undefined, null, ""]
        if( nothingCriteria.includes(color) ) {
            console.log(prompt)
        
        } else {
            console.log(color + prompt + cliColors.FgWhite)
        }
        
        return ( await rl[Symbol.asyncIterator]().next() ).value
    }

    async yesNoQuestion(prompt) {
        let userTyping = await this.input(prompt)
        userTyping = userTyping.toLowerCase().trim()

        const criteria = ["y", "yes", "yeah"]
        
        return criteria.includes(userTyping) 
    }

    deinit() {
        rl.close()
    }
}

module.exports = new UserInput()