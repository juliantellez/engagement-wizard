const BASE_URL = 'https://api.twitter.com'

const dictionary = {
  user: {
    following: (userId: string): string =>
      `${BASE_URL}/2/users/${userId}/following`,
    followers: (userId: string): string =>
      `${BASE_URL}/2/users/${userId}/followers`,
  },
}

export { dictionary }
