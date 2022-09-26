const changeStringToDate = (str) => {
  const year = str.substr(0, 4)
  let month = str.substr(5, 2)
  const day = str.substr(8, 2)
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  month = months[parseInt(month) - 1]

  return month + ' ' + day + ', ' + year
}

export default changeStringToDate
