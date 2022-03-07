const tableRowMinHeight = 30
const tableFooterThickerBorder = "1.5px solid black"

module.exports = `
* {
    font-family: "Helvetica Neue";
    font-size: 16px;
}

.html-report-container {
    margin: 0 10%;
    width: 1280px;
}

.invoice-date-container p {
    font-size: 1rem;
}

.invoice-heading-data-list {
    padding-left: 0;
}

.invoice-heading-data-list li {
    list-style-type: none;
    margin-bottom: 3px;
}

.invoice-items-table {
    border-collapse: collapse;
    width: 60%;
}

.invoice-items-table thead {
    background-color: rgb(57, 113, 149);
}

.invoice-items-table thead tr {
    border: 0;
    color: white;
    font-weight: bold;
    height: ${ tableRowMinHeight * 2 }px;
    vertical-align: top;
    text-align: left;
}

.invoice-items-table thead th:first-child {
    border-right: 1px solid white;
}

.invoice-items-table thead th {
    padding: 8px;
}

.invoice-items-table td {
    padding: 8px;
}

.invoice-items-table tr {
    height: ${ tableRowMinHeight }px;
}

.invoice-items-table tbody tr {
    border-bottom: 1px dotted black;
}

.invoice-items-table tbody tr>td:first-child,
.invoice-items-table tfoot tr>td:first-child {
    border-right: 1px dotted black;
}

.invoice-items-table tbody tr>td:nth-child(2),
.invoice-items-table tfoot tr>td:nth-child(2) {
    text-align: right;
}

.invoice-items-table tfoot {
    border-top: ${ tableFooterThickerBorder };
    border-bottom: ${ tableFooterThickerBorder };
    font-weight: bold;
}

.invoice-terms-and-conditions p {
    line-height: 1.4rem;
}
`