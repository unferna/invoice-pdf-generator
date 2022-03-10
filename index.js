require("./Prototypes")

const pdf = require("html-pdf-node")
const content = require("./HTMLSource")

const userInput = require("./readline-interface")
const cliColors = require("./cli-colors")
const Utils = require("./Utils")
const fs = require("fs")

const defaultPathFileContainer = "./default-path.txt"
const firstName = require("./default-data.json").firstName

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

const range = (size, startAt = 0) => {
    return [ ...Array(size).keys() ].map(item => item + startAt)
}

const exportPDF = (monthPath, fileName) => {
    fs.mkdir(monthPath, { recursive: true }, (err, _) => {
        if(!err) {
            const options = { 
                format: "A4",
                path: monthPath + "/" + fileName,
                printBackground: true,
                margin: {
                    top: "0.5in",
                    right: "0.5in",
                    bottom: "0.5in",
                    left: "0.5in"
                }
            }
        
            const file = {
                content
            }
        
            pdf.generatePdf(file, options).then(pdfBuffer => {
                console.log("PDF Buffer:-", pdfBuffer)
                userInput.deinit()
            })
        
        } else {
            console.log(cliColors.FgRed + "An error has ocurred!")
            console.log(err)
            process.exit()
        }
    })
}

const loadDefaultPath = () => {
    const data = fs.readFileSync(defaultPathFileContainer, { encoding: "utf8", flag: "r" })
    return data.toString().trim()
}

const savePathAsDefault = path => {
    fs.writeFileSync(defaultPathFileContainer, path)
}

const fileNameFor = month => {
    let resultName = ""
    
    if( firstName.lastCharacter() == "s" ) {
        resultName = firstName + "'"
    
    } else {
        resultName = firstName + "'s"
    }

    return resultName + " Invoice - " + month + ".pdf"
}

const main = async () => {
    let shouldProcessRepeat = false

    do {
        const monthsString = months.map((month, index) => {
            return `${index + 1} - ${month}`
        }).join("\n")

        const month = await userInput.input(`Choose a month\n${monthsString}`)
        const monthIndex = parseInt(month) - 1
        
        if( !range(12).includes(monthIndex) ) {
            console.log(`${cliColors.FgRed}Invalid month!`)
            process.exit()
        }

        console.log(months[monthIndex], "selected!")

        const latestTemplate = await userInput.yesNoQuestion(`Do you wanna use the default template based in the latest one? [y/n]`)

        if( !latestTemplate ) {
            // Normal Process here
        } else {
            const defaultPath = loadDefaultPath()
            let selectedBasePath = defaultPath

            if( !defaultPath.isEmpty() ) {
                console.log("Select a path. Leave it blank to use default")
                const newPath = await userInput.input(`Current: ${ defaultPath }`, cliColors.FgGreen)
                
                if( !newPath.isEmpty() ) {
                    selectedBasePath = newPath    
                }

            } else {
                selectedBasePath = await userInput.input("Path destination:")
                savePathAsDefault(path)
            }
        
            const monthPath = Utils.addLeftZeroIfNeeded(monthIndex + 1) + " - " + months[monthIndex]
        
            if( selectedBasePath.lastCharacter() != "/" ) {
                selectedBasePath += "/"
            }
            
            exportPDF(selectedBasePath + monthPath, fileNameFor(months[monthIndex]))
        }
        
    } while( shouldProcessRepeat )
}

main()