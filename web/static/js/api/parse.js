import yayson from 'yayson'

const {Store} = yayson()
const store = new Store()

export default function parse(data) {
  return store.sync(data)
}
