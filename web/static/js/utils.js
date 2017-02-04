import R from 'ramda'
import {parseErrors} from 'app/api'

export const insertChangesetErrors = errors =>
  R.mergeWith(R.concat, parseErrors(errors))
