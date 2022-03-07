const pdf = require("html-pdf-node")
const content = require("./HTMLSource")

const options = { 
    format: "A4",
    path: "./Test2.pdf",
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
})