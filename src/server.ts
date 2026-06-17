import TodoListClass, { Item } from "./core"
const todolist = new TodoListClass("todolist.json")

async function testRoute(req: Bun.BunRequest) {
  return Response.json({
    method: req.method,
    time: new Date().toLocaleString('pt-BR'),
    body: await req.body?.text(),
  });
}

const server = Bun.serve({
  port: 3000,
  routes: {
    '/': (req) => new Response(Bun.file('.public/index.html')),
    '/api-debugger': (req) => new Response(Bun.file('./public/api-debugger.html')),
    '/test': testRoute,
    
    '/todo': {
      GET: async () => {
        const items = await todolist.getItems()
        return Response.json(items)
      },

      POST: async (req) => {
        let data
  
        try {
          data = await req.body?.json()
        } catch(e) {
          return new Response('json inválido', { status: 400 })
        }

        if (!data.title) 
          return new Response('É preciso informar title', { status: 400 })

        try {
          await todolist.addItem(new Item(data.title))
        } catch (error) {
          return new Response('Erro ao adicionar item', { status: 500 })
        }

        return new Response('Created', { status: 201 })
      }
    }
  },
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);