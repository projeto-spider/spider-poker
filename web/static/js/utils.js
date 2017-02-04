import R from 'ramda'
import {parseErrors} from 'app/api'

export const resolveAsJson = async res => {
  const json = await res.json()

  return R.pipe(
    R.dissoc('body'),
    R.merge(json)
  )(res)
}

export const resolveErrorAsJson = async res => {
  throw (await resolveAsJson(res))
}

export const insertChangesetErrors = errors =>
  R.mergeWith(R.concat, parseErrors(errors))
