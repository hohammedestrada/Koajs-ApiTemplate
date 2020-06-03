/**
 * person.controller.js
 * Responsable por recibir las solicitudes http desde el router person.route.js
 */
const PersonRepository = require('../repositories/person.repository')
const repository = new PersonRepository()

module.exports = class PersonController {
  /**
   *
   * @param {object} ctx: contexto de koa que contiene los parameteros de la solicitud, en este caso
   * desde el url de donde sacaremos el valor del parametro index (ctx.params.index)
   */
  async getByIndex(ctx) {
    const index = ctx.params.index && !isNaN(ctx.params.index) ? parseInt(ctx.params.index) : 0
    if (index > 0) {
      const filter = { index: index }
      const data = await repository.findOne(filter)
      if (data) {
        ctx.body = data
      } else {
        ctx.throw(404, `No se ha encontrado la persona con el indice ${index}`)
      }
    } else {
      ctx.throw(422, `Valor ${ctx.params.index} no soportado`)
    }
  }

  /**
   *
   * @param {object} ctx:
   * obtendremos las query a traves a traves de ctx.query
   */
  async getUsersByQuery(ctx) {
    const query = ctx.request.query
    let filter = {}
    let pagination = {}
    let flag = true

    for (var keys in query) {
      if (keys !== 'page' && keys !== 'limit') {
        filter[keys] = query[keys]
      } else {
        pagination[keys] = !isNaN(query[keys]) ? parseInt(query[keys]) : query[keys]
        if (isNaN(query[keys])) {
          flag= false
          break
        }
      }
    }

    if (flag) {
      const data = await repository.getUsers(filter, pagination)
      if (data === null || data === undefined) ctx.throw(500, 'Error Internal Server')
      if (data.statusCode === 404) ctx.throw(404, data.error)
      ctx.body = data
    } else {
      ctx.throw(422, `Valor ${JSON.stringify(pagination)} not supported`)
    }
  }

  /**
   *
   * @param {object} ctx: contexto de koa que contiene los parameteros de la solicitud, en este caso desde el body,
   * obtendremos las propiedades de la persona a guardar a traves de ctx.request.body
   */
  async save(ctx) {
    const person = ctx.request.body
    await repository.save(person, true)
    ctx.body = person
  }
}
