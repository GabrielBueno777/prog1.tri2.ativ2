/**
 * @todo
 * known issues:
 * - getItems needs to await loadListFromDisk()
 */

// class Item_ { 
//   public title: string
//   constructor(title: string) {
//     this.title = title
//   }
// }

class Item {
  constructor(public title: string) { }
}

class TodoList {
  private items: Promise<Item[]>
  private filePath: string

  constructor(filePath: string) {
    this.filePath = filePath
    this.items = this.loadListFromDisk()
  }

  private async saveListToDisk() {
    const file = Bun.file(this.filePath)
    const data = JSON.stringify(await this.items)
    await file.write(data)
  }

  private async loadListFromDisk() {
    const file = Bun.file(this.filePath)
    // // const text = await file.text()
    // // const data = JSON.parse(text)
    const data = await file.json() as Item[]
    const items = data.map((v: any) => new Item(v.title))
    return items
  }

  /**
   * Função que adiciona um novo item a lista
   */
  async addItem(item: Item) {
    const items = await this.items
    if (!item) 
      throw "Item inválido"
    if (!item.title.trim())
      throw "Item deve conter um título"
    items.push(item)
    await this.saveListToDisk()
  }

  /**
   * Remove item da lista por um indice
   */
  async removeItem(index: number) {
    const items = await this.items
    items.splice(index, 1)
    await this.saveListToDisk()
  }

  /**
   * Retorna a cópia da lista de itens
   */
  async getItems() {
    const items = await this.items
    return Array.from(items)
  }
}

export default TodoList
export { TodoList, Item }