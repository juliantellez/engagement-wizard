/* eslint-disable no-console */
import { EMPTY, Observable } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'

import { createFetchRetryStream } from '../../createFetchRetryStream'

interface CreateUserStreamInput {
  token: string
  url: string
  onError?: (e: Error) => void
}

interface CreateUserStreamOutput {
  id: string
  name: string
  username: string
}

const createUserStream = ({
  token,
  url,
  onError = (e) => console.log(e),
}: CreateUserStreamInput): Observable<CreateUserStreamOutput> => {
  return createFetchRetryStream({
    url,
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
        id: response.data.id,
        name: response.data.name,
        username: response.data.username,
      }
    }),
    catchError((e) => {
      onError(e)
      return EMPTY
    })
  )
}

export { createUserStream }
