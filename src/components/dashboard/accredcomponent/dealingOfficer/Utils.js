export const useUtils = () => {
  const downloadCSV = (data, headers, filename) => {
    const csvRows = []

    // Add headers
    const headerRow = headers.map((header) => header.label).join(',')
    csvRows.push(headerRow)

    // Add data rows
    data.forEach((item) => {
      const values = headers.map((header) => {
        const key = header.key
        let value = item[key]
        if (value === null || value === undefined) {
          value = 'N/A' // Or handle null/undefined values as needed
        } else if (typeof value === 'string') {
          value = `"${value.replace(/"/g, '""')}"` // Escape double quotes in strings
        }
        return value
      })
      csvRows.push(values.join(','))
    })

    const csvString = csvRows.join('\r\n')
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })

    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) // Clean up
    URL.revokeObjectURL(url) // Free up memory
  }

  return { downloadCSV }
}
