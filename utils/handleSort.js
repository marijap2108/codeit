export const handleSort = (type) => { 
  switch (type) {
    case 'hot':
      return {'votesUpCount': -1, 'votesDownCount': 1}
    case 'new':
      return {'createdOn': -1}
    case 'top': 
      return {'voteCount': -1, 'votesDownCount': 1}
    case 'controversial':
      return {'votesDownCount': -1, 'votesUpCount': 1}
    default:
      return null 
  }
}