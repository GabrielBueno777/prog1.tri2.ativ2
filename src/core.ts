// @ts-nocheck
class Item {
  constructor(public title: string) {}
}

class TodoList {
  private items: Promise<Item[]>;
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.items = this.loadListFromDisk();
  }

  // Salva a lista no arquivo
  private async saveListToDisk() {
    const file = Bun.file(this.filePath);
    const data = JSON.stringify(await this.items, null, 2);
    await file.write(data);
  }

  // Carrega a lista do arquivo
  private async loadListFromDisk() {
    const file = Bun.file(this.filePath);

    if (!(await file.exists())) {
      await Bun.write(this.filePath, "[]");
      return [];
    }

    const data = await file.json() as Item[];
    return data.map(item => new Item(item.title));
  }

  // Adiciona um item
  async addItem(item: Item) {
    const items = await this.items;

    if (!item)
      throw "Item inválido";

    if (!item.title || item.title.trim() === "")
      throw "O item deve possuir um título.";

    items.push(item);

    await this.saveListToDisk();
  }

  // Remove um item
  async removeItem(index: number) {
    const items = await this.items;

    if (index < 0 || index >= items.length)
      throw "Índice inválido.";

    items.splice(index, 1);

    await this.saveListToDisk();
  }

  // Atualiza um item
  async updateItem(index: number, title: string) {
    const items = await this.items;

    if (index < 0 || index >= items.length)
      throw "Índice inválido.";

    if (!title || title.trim() === "")
      throw "Título inválido.";

    items[index].title = title;

    await this.saveListToDisk();
  }

  // Retorna uma cópia da lista
  async getItems() {
    const items = await this.items;
    return Array.from(items);
  }
}

export default TodoList;
export { TodoList, Item };