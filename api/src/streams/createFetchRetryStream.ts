/* eslint-disable no-console */
import { Response, RequestInit } from 'node-fetch'
import { Observable } from 'rxjs'
import { retryWhen, timeout } from 'rxjs/operators'

import { env } from '../env'

import { createFetchStream } from './createFetchStream'
import { createLinearRetryStream } from './createLinearRetryStream'

interface CreateFollowersStreamInput {
  url: string
  options?: RequestInit
  handleFetch?: typeof createFetchStream
  handleRetry?: typeof createLinearRetryStream
}

const createFetchRetryStream = ({
  url,
  options,
  handleFetch = createFetchStream,
  handleRetry = createLinearRetryStream,
}: CreateFollowersStreamInput): Observable<Response> => {
  return handleFetch({ url, options }).pipe(
    timeout(env.api.timeOut),
    retryWhen((error$) => {
      return handleRetry({
        error$,
        retryLog: (l) => {
          console.log(l)
        },
      })
    })
  )
}

export { createFetchRetryStream }
