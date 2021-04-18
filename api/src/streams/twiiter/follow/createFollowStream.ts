/* eslint-disable no-console */
import { EMPTY, Observable } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'

import { createFetchRetryStream } from '../../createFetchRetryStream'

interface CreateFollowStreamInput {
  params: {
    maxResults: number
    paginationToken?: string
  }
  token: string
  url: string
  onError?: (e: Error) => void
}

export interface User {
  id: number
  name: string
}

export interface CreateFollowStreamOutput {
  data: User[]
  meta: {
    resultCount: number
    nextToken: string
  }
}

/**
 * Creates a stream for both following and follower apis
 * see https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-following
 * see https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-followers
 */
const createFollowStream = ({
  url,
  params,
  token,
  onError = (e) => console.log(e),
}: CreateFollowStreamInput): Observable<CreateFollowStreamOutput> => {
  const urlParams = new URLSearchParams()
  urlParams.set('max_results', String(params.maxResults))
  if (params.paginationToken) {
    urlParams.set('pagination_token', params.paginationToken)
  }

  const parsedUrl = `${url}?${urlParams.toString()}`

  return createFetchRetryStream({
    url: parsedUrl,
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  }).pipe(
    mergeMap((response) => {
      if (!response.ok) {
        throw new Error(JSON.stringify(response))
      }
      return response.json()
    }),
    map((response) => {
      if (response.error) {
        throw new Error(JSON.stringify(response.error))
      }

      if (response.errors) {
        throw new Error(JSON.stringify(response.errors))
      }

      if (!response.data) {
        throw new Error('NO DATA' + JSON.stringify(response))
      }
      return response
    }),
    map((response) => {
      return {
        data: response.data,
        ...(response.meta && {
          meta: {
            resultCount: response.meta.result_count,
            nextToken: response.meta.next_token,
          },
        }),
      }
    }),
    catchError((e) => {
      onError(e)
      return EMPTY
    })
  )
}

export { createFollowStream }
