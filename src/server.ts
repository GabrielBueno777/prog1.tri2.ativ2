// @ts-nocheck
import TodoList, { Item } from "./core";

const todolist = new TodoList("todolist.json");

async function testRoute(req: Bun.BunRequest) {
  return Response.json({
    method: req.method,
    time: new Date().toLocaleString("pt-BR"),
    body: await req.text()
  });
}

const server = Bun.serve({
  port: 3000,

  routes: {
    "/": () => {
      return new Response(Bun.file("./public/index.html"));
    },

    "/api-debugger": () => {
      return new Response(Bun.file("./public/api-debugger.html"));
    },

    "/test": testRoute,

    // ==========================
    // GET /todo
    // ==========================
    "/todo": {
      GET: async () => {
        const items = await todolist.getItems();
        return Response.json(items);
      },

      // ==========================
      // POST /todo
      // ==========================
      POST: async (req) => {
        let data;

        try {
          data = await req.json();
        } catch {
          return new Response("JSON inválido", {
            status: 400
          });
        }

        if (!data.title) {
          return new Response("É necessário informar o campo title.", {
            status: 400
          });
        }

        try {
          await todolist.addItem(new Item(data.title));

          return new Response("Item criado com sucesso.", {
            status: 201
          });

        } catch (erro) {

          return new Response(String(erro), {
            status: 400
          });

        }
      }
    },

    // ==========================
    // PUT e DELETE
    // ==========================
    "/todo/:id": {

      // Atualizar
      PUT: async (req) => {

        const index = Number(req.params.id);

        if (isNaN(index)) {
          return new Response("Índice inválido.", {
            status: 400
          });
        }

        let data;

        try {
          data = await req.json();
        } catch {
          return new Response("JSON inválido.", {
            status: 400
          });
        }

        try {

          await todolist.updateItem(index, data.title);

          return new Response("Item atualizado.", {
            status: 200
          });

        } catch (erro) {

          return new Response(String(erro), {
            status: 400
          });

        }
      },

      // Excluir
      DELETE: async (req) => {

        const index = Number(req.params.id);

        if (isNaN(index)) {
          return new Response("Índice inválido.", {
            status: 400
          });
        }

        try {

          await todolist.removeItem(index);

          return new Response("Item removido.", {
            status: 200
          });

        } catch (erro) {

          return new Response(String(erro), {
            status: 400
          });

        }
      }
    }
  },

  // Arquivos estáticos e 404
  async fetch(req) {

    const url = new URL(req.url);

    const file = Bun.file("./public" + url.pathname);

    if (await file.exists()) {
      return new Response(file);
    }

    return new Response("404 - Página não encontrada", {
      status: 404
    });

  }

});

console.log(`Servidor rodando em http://localhost:${server.port}`);