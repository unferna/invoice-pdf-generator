const styles = require("./HtmlReportStyles")

class PDFReport {
    invoiceData = {}
    totalInvoice = 0
    invoiceDateString = ""

    constructor() {
        this.invoiceData = {}
        this.totalInvoice = 0
        this.invoiceDateString = ""
    }

    loadInvoiceData(data) {
        this.invoiceData = data
        this.totalInvoice = data.itemsToCharge
            .map(item => item.total)
            .reduce((prev, current) => prev + current, 0)
    }

    TermsAndCondtionsComponent() {
        const { termsAndConditionsData } = this.invoiceData
        const bank = termsAndConditionsData.find(item => {
            return item.key === "bank"
        }).value

        const account = termsAndConditionsData.find(item => {
            return item.key === "bank"
        }).value

        const routingNumber = termsAndConditionsData.find(item => {
            return item.key === "routingNumber"
        }).value

        const bankCity = termsAndConditionsData.find(item => {
            return item.key === "bankCity"
        }).value

        const bankAddress = termsAndConditionsData.find(item => {
            return item.key === "bankAddress"
        }).value

        const resultString = `<div class="invoice-terms-and-conditions">
                <h3>TERMS & CONDITIONS</h3>
    
                <p>Please transfer:<br /><br />$${ this.totalInvoice } to ${ bank } Account ${ account }<br />Routing Number: ${ routingNumber }<br />Bank Branch Address:<br />${ bankCity }<br />${ bankAddress }</p>
            </div>`

        return resultString
    }

    reportHTMLString() {
        return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>03 - March Invoice</title>
                <style>
                ${ styles }
                </style>
            </head>
        <body>
            <div class="html-report-container">
                <div class="invoice-date-container">
                    <p>Invoice Date: ${ this.invoiceDateString }</p>
                </div>
    
                <ul class="invoice-heading-data-list">
                    <li><strong>${ this.invoiceData.fullName }</strong></li>
                    ${ this.invoiceData.headingData.map(data => (
                        `<li>${ data.label }: ${ data.value }</li>`
                    )).join("") }
                </ul>
    
                <table class="invoice-items-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        ${ this.invoiceData.itemsToCharge.map(item => (
                            `<tr>
                                <td>${ item.description }</td>
                                <td>${ this.invoiceData.coinToUse } ${ item.total }</td>
                            </tr>`
                        )).join("") }
                        <tr>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
    
                    <tfoot>
                        <tr>
                            <td>Total</td>
                            <td>${ this.invoiceData.coinToUse } ${ this.totalInvoice }</td>
                        </tr>
                    </tfoot>
                </table>
                ${ this.TermsAndCondtionsComponent() }
            </div>
        </body>
        </html>
        `
    }
}

module.exports = new PDFReport()