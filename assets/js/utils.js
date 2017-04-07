import R from 'ramda'
import objectKeysToCase from 'object-keys-to-case'
import camelCase from 'camel-case'
import snakeCase from 'snake-case'

export const casefy = fn => data => {
  if (Array.isArray(data)) {
    return data.map(obj => objectKeysToCase(obj, fn))
  }

  return objectKeysToCase(data, fn)
}

export const camelize =
  casefy(camelCase)

export const snakefy =
  casefy(snakeCase)

export const resolveAsJson = async res => {
  const {meta = {}, data = {}, ...rest} = res.body

  return {
    meta: camelize(meta),
    data: Array.isArray(data) ? data.map(camelize) : camelize(data),
    ...camelize(rest)
  }
}

export const resolveErrorAsJson = async res => {
  throw (await resolveAsJson(res))
}

export const insertChangesetErrors = errors =>
  R.mergeWith(R.concat, errors)

export const apiRequest = request =>
  request
    .then(resolveAsJson)
    .catch(resolveErrorAsJson)
