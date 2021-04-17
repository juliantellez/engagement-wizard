/* eslint-disable no-console */
import { EMPTY, Observable, Subject } from 'rxjs'
import { expand, takeUntil } from 'rxjs/operators'

import { env } from '../../../env'

import {
  createFollowStream,
  CreateFollowStreamOutput,
} from './createFollowStream'

const MAX_RESULTS = env.api.maxResults

interface CreatePaginatedFollowStreamInput {
  token: string
  url: string
}

/**
 * Implements pagination
 */
const createPaginatedFollowStream = ({
  url,
  token,
}: CreatePaginatedFollowStreamInput): Observable<CreateFollowStreamOutput> => {
  const stop$ = new Subject()

  return createFollowStream({
    url,
    token,
    params: {
      maxResults: MAX_RESULTS,
    },
  }).pipe(
    takeUntil(stop$),
    expand((response) => {
      if (!response.meta || !response.meta.nextToken) {
        stop$.next()
        return EMPTY
      }

      return createFollowStream({
        url,
        token,
        params: {
          maxResults: MAX_RESULTS,
          paginationToken: response.meta.nextToken,
        },
      })
    })
  )
}

export { createPaginatedFollowStream }
