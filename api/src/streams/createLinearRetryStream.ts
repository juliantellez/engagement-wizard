import { Observable } from 'rxjs/internal/Observable'
import { delay, map, scan } from 'rxjs/operators'

import { env } from '../env'

interface RetryError {
  counter: number
  error: unknown
}

const initialError: RetryError = {
  counter: 0,
  error: void 0,
}

interface CreateLinearRetryStreamInput {
  error$: Observable<unknown>
  retryLog: ({ hint, error }: { hint: string; error: unknown }) => void
  delayTime?: number
  retryLimit?: number
}

const createLinearRetryStream = ({
  error$,
  delayTime = env.api.retryDelay,
  retryLimit = env.api.retry,
  retryLog,
}: CreateLinearRetryStreamInput): Observable<RetryError> => {
  return error$.pipe(
    scan((acc, error) => ({ counter: acc.counter + 1, error }), initialError),
    map((current) => {
      if (current.counter > retryLimit) {
        throw current.error
      }
      retryLog({
        hint: `Retry attempt ${current.counter}`,
        error: current.error,
      })

      return current
    }),
    delay(delayTime)
  )
}

export { createLinearRetryStream }
