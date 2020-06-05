// importa os módulos e aqruivos necessários
const request = require('supertest')
const server = require('./../../src/server')

// import server from "./../../src/server";
// import request from "supertest";

// o que será executado antes de todos os testes
beforeAll(async () => {
  console.log('Iniciando TDD com jest!')
})

//o que será executado após todos os testes
afterAll(() => {
  // o server close irá encerrar nossa aplicação, evitando problemas da porta já estar em uso
  // server.close()
  console.log('servidor fechado')
})

describe('Inicio de Test with Jest!!!!!', () => {
  test('Hello world works', async () => {
    const response = await request(server).get('/')
    expect(response.status).toBe(200)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.text).toMatchSnapshot()
  })
})
