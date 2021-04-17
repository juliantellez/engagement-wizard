import { Observable } from 'rxjs'
import fetch, { Response, RequestInit } from 'node-fetch'

interface CreateFetchStreamInput {
  url: string
  options?: RequestInit
  httpHandler?: typeof fetch
}

const createFetchStream = ({
  url,
  options,
  httpHandler = fetch,
}: CreateFetchStreamInput): Observable<Response> => {
  const $ = new Observable<Response>((subscriber) => {
    httpHandler(url, options)
      .then((response) => {
        if (!response.ok) {
          return subscriber.error(response)
        }

        subscriber.next(response)
        subscriber.complete()
      })
      .catch((error) => {
        subscriber.error(error)
      })
  })

  return $
}

export { createFetchStream }
