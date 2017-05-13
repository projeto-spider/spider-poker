import R from 'ramda'
import objectKeysToCase from 'object-keys-to-case'
import camelCase from 'camel-case'
import snakeCase from 'snake-case'

export const TABLET_WIDTH = 769
export const DESKTOP_WIDTH = 1000
export const WIDESCREEN_WIDTH = 1192
export const FULLHD_WIDTH = 1384

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

// Enhance an already made VueResource HTTP request
export const request = httpRequest =>
  httpRequest
    .then(resolveAsJson)
    .catch(resolveErrorAsJson)
