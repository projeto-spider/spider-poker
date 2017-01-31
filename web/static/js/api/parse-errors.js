const getField = ({pointer}) => {
  const fieldRegex = /\/data\/attributes\/(.*)/
  const [, field] = fieldRegex.exec(pointer)
  return field
    .replace('-', '_')
}

const fetchFieldFromSource = ({title, source, detail}) => ({
  field: getField(source),
  title,
  detail
})

const aggregateByField = (acc, error) => {
  if (!acc[error.field]) {
    acc[error.field] = []
  }

  acc[error.field].push(error)

  return acc
}

export default function parseErrors(errors) {
  return errors
    .map(fetchFieldFromSource)
    .reduce(aggregateByField, {})
}
