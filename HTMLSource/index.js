const invoiceData = require("../default-data.json")
const styles = require("./HtmlReportStyles")

const addLeftZeroIfNeeded = number => {
    if( number < 0 && number > -10 ) {
        return `${number}`.replace("-", "-0")
    
    } else if ( number >= 0 && number < 10 ) {
        return `0${ number }`
    }

    return String(number)
}

const now = new Date()
const invoiceDateString = [
    addLeftZeroIfNeeded( now.getDate() ),
    addLeftZeroIfNeeded( now.getMonth() + 1 ),
    now.getFullYear()
].join("/")

const totalInvoice = invoiceData.itemsToCharge
    .map(item => item.total)
    .reduce((prev, current) => prev + current, 0)

const TermsAndCondtionsComponent = (totalInvoice, termsAndConditionsData) => {
    return `<div class="invoice-terms-and-conditions">
            <h3>TERMS & CONDITIONS</h3>

            <p>Please transfer:<br /><br />$${totalInvoice} to ${ termsAndConditionsData.bank } Account ${ termsAndConditionsData.account }<br />Routing Number: ${ termsAndConditionsData.routingNumber }<br />Bank Branch Address:<br />${ termsAndConditionsData.bankCity }<br />${ termsAndConditionsData.bankAddress }</p>
        </div>`
}

const FullReport = () => {
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
                <p>Invoice Date: ${ invoiceDateString }</p>
            </div>

            <ul class="invoice-heading-data-list">
                <li><strong>${ invoiceData.myFuckingName }</strong></li>
                ${ invoiceData.headingData.map(data => (
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
                    ${ invoiceData.itemsToCharge.map(item => (
                        `<tr>
                            <td>${ item.description }</td>
                            <td>${ invoiceData.coinToUse } ${ item.total }</td>
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
                        <td>${ invoiceData.coinToUse } ${ totalInvoice }</td>
                    </tr>
                </tfoot>
            </table>
            ${ TermsAndCondtionsComponent( totalInvoice, invoiceData.termsAndConditionsData ) }
        </div>
    </body>
    </html>
    `
}

const report = FullReport()
module.exports = report