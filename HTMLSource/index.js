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
            </div>
        </body>
        </html>
        `
    }
}

module.exports = new PDFReport()