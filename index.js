require("events").EventEmitter.defaultMaxListeners = 0

require("./Prototypes")

const pdf = require("html-pdf-node")
const content = require("./HTMLSource")

const userInput = require("./readline-interface")
const cliColors = require("./cli-colors")
const Utils = require("./Utils")
const fs = require("fs")

const defaultPathFileContainer = "./default-path.txt"

const INVOICE_DATA_PATH = "./default-data.json"
const invoiceData = require(INVOICE_DATA_PATH)
let invoiceDataCopy = invoiceData
const firstName = invoiceData.firstName

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

const printError = message => {
    console.log(cliColors.FgRed + message + cliColors.FgWhite)
}

const printSuccess = message => {
    console.log(cliColors.FgGreen + message + cliColors.FgWhite)
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
                content: content.reportHTMLString()
            }
        
            pdf.generatePdf(file, options).then(pdfBuffer => {
                console.log("PDF Buffer:-", pdfBuffer)
                userInput.deinit()
            })
        
        } else {
            printError("An error has ocurred!")
            console.log(err)
            process.exit()
        }
    })
}

const loadDefaultPath = () => {
    const fileDescriptor = fs.openSync(defaultPathFileContainer)
    const data = fs.readFileSync(defaultPathFileContainer, { encoding: "utf8", flag: "r" })
    fs.closeSync(fileDescriptor)
    return data.toString().trim()
}

const savePathAsDefault = path => {
    const fileDescriptor = fs.openSync(path)
    fs.writeFileSync(defaultPathFileContainer, path)
    fs.closeSync(fileDescriptor)
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

const updateJson = newData => {
    const fileDescriptor = fs.openSync(INVOICE_DATA_PATH)
    fs.writeFileSync(INVOICE_DATA_PATH, JSON.stringify(newData, null, 4), { encoding: "utf-8" })
    fs.closeSync(fileDescriptor)
}

const prepareExport = async (monthIndex) => {
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

const nextItemIdFor = itemsToCharge => {
    const currentIds = itemsToCharge.map(item => item.id)
    const lastItem = currentIds.pop()
    return lastItem + 1
}

const main = async () => {
    let shouldProcessRepeat = false

    do {
        const monthsString = months.map((month, index) => {
            return `${index + 1} - ${month}`
        }).join("\n")

        const month = await userInput.input(`Choose a month\n${monthsString}`)
        const monthIndex = parseInt(month) - 1
        
        if( !Utils.range(12).includes(monthIndex) ) {
            printError("Invalid Month!")
            process.exit()
        }

        console.log(months[monthIndex], "selected!")
        const now = new Date()
        const defaultDateString = now.todayString()
        console.log("Select invoice date with dd/MM/yyyy format. Leave it blank to use default.")
        const newDate = await userInput.input(`Default ${ defaultDateString }`, cliColors.FgGreen)

        if( !newDate.isEmpty() ) {
            if( Utils.validateUserInputDate(newDate) ) {
                content.invoiceDateString = newDate
            
            } else {
                printError("Invalid Date Typed. Default Selected")
                content.invoiceDateString = defaultDateString
            }

        } else {
            content.invoiceDateString = defaultDateString
        }

        const latestTemplate = await userInput.yesNoQuestion(`Do you wanna use the default template based in the latest one?`)

        if( !latestTemplate ) {
            // Normal Process here
            let newFirstName = invoiceData.firstName
            let newFullName = invoiceData.fullName
            let newHeadingData = invoiceData.headingData
            let newItemsToCharge = invoiceData.itemsToCharge

            // Heading
            if( await userInput.yesNoQuestion("Would you like to change heading?") ) {
                newFirstName = await userInput.input(`First name (${ firstName }):`, cliColors.FgGreen)
                newFullName = await userInput.input(`Full name (${ invoiceData.fullName }):`)

                let headingIterator = 0

                do {
                    const item = invoiceData.headingData[ headingIterator ]
                    const input = await userInput.input(`${ item.label } (${ item.value }):`, cliColors.FgGreen)
                    if( !input.isEmpty() ) {
                        newHeadingData[headingIterator].value = input
                    } 

                    headingIterator += 1
                } while ( headingIterator < newHeadingData.length )
            }

            let itemsToChargeChangesDone = false
            
            do {
                console.log(`${cliColors.FgYellow}Current Items${cliColors.FgWhite}`)
                console.log(JSON.stringify(newItemsToCharge, null, 2))
                if( await userInput.yesNoQuestion("Would you like to modify any of the items or add a new one?") ) {
                    const userSelection = await userInput.input(`1 - Add one more item\n2 - Delete one item\nEnter - Continue`)

                    switch( userSelection.trim() ) {
                        case "1":
                            const newItemDescription = await userInput.input("Description:")
                            const newItemValue = await userInput.input("Total:")
                            
                            newItemsToCharge.push({ 
                                id: nextItemIdFor(invoiceData.itemsToCharge),
                                description: newItemDescription,
                                total: parseFloat(newItemValue)
                            })
                            
                            printSuccess("Added!\n")
                        break

                        case "2":
                            const idString = await userInput.input("Item ID:")
                            const id = parseInt(idString)
                            const existingIds = newItemsToCharge.map(item => item.id)
                            
                            if( existingIds.includes(id) ) {
                                newItemsToCharge = newItemsToCharge.filter(item => item.id != id)
                                printSuccess("Deleted!\n")
                            
                            } else {
                                printError("Invalid ID!\n")
                            }
                        break

                        default:
                            itemsToChargeChangesDone = true
                    }
                } else {
                    itemsToChargeChangesDone = true
                }

            } while( !itemsToChargeChangesDone )
            
            invoiceDataCopy.firstName = newFirstName
            invoiceDataCopy.fullName = newFullName
            invoiceDataCopy.headingData = newHeadingData
            invoiceDataCopy.itemsToCharge = newItemsToCharge
            updateJson(invoiceDataCopy)
            
            content.loadInvoiceData(invoiceDataCopy)

        } else {
            content.loadInvoiceData(invoiceData)
        }

        prepareExport(monthIndex)

    } while( shouldProcessRepeat )
}

main()