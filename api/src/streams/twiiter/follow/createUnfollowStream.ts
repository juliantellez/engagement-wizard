/* eslint-disable no-console */
import { EMPTY, Observable } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'

import { createFetchRetryStream } from '../../createFetchRetryStream'

interface CreateUnfollowStreamInput {
  accessToken: string
  url: string
  onError?: (e: Error) => void
}

interface CreateUnfollowStreamOutput {
  data: {
    following: boolean
  }
}

const createUnfollowStream = ({
  url,
  accessToken,
  onError = (e) => console.log(e),
}: CreateUnfollowStreamInput): Observable<CreateUnfollowStreamOutput> => {
  return createFetchRetryStream({
    url,
    options: {
      method: 'DELETE',
      headers: {
        Authorization: `OAuth ${accessToken}`,
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
      }
    }),
    catchError((e) => {
      onError(e)
      return EMPTY
    })
  )
}

export { createUnfollowStream }
