const BASE_URL = 'https://api.twitter.com'

const dictionary = {
  follows: {
    getFollowing: (userId: string): string =>
      `${BASE_URL}/2/users/${userId}/following`,
    getFollowers: (userId: string): string =>
      `${BASE_URL}/2/users/${userId}/followers`,
    deleteFollow: (sourceUserId: string, targetUserId: string): string =>
      `${BASE_URL}/2/users/${sourceUserId}/following/${targetUserId}`,
  },
  user: {
    getByUserName: (userName: string): string =>
      `${BASE_URL}/2/users/by/username/${userName}`,
  },
}

export { dictionary }
