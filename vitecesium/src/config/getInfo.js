import axios from 'axios'

export default {
  getInfoById(id) {
    return new Promise(function (resolve, reject) {
      axios
        .get('http://localhost:3000/api/psline?_where=(id,eq,' + id + ')')
        .then((res) => {
          resolve(res.data[0])
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
}
