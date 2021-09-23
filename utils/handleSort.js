export const handleSort = (type) => { 
  switch (type) {
    case 'new':
      return {createdOn: -1}
    case 'top': 
      return {votesUp: -1}
    case 'controversial':
      return {votesDown: -1}
    default:
      return null 
  }
}