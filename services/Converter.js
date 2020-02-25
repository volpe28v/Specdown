export default function(markdown) {
  const st = new SpecTree()
  markdown.split('\n').forEach((line) => st.add(line))
  return st.toSpec()
}

class SpecTree {
  constructor() {
    this.nodes = []
  }

  add(line) {
    const node = new Node(line)
    const lastNode =
      this.nodes.length !== 0 ? this.nodes[this.nodes.length - 1] : null
    this.nodes.push(node)

    if (!(lastNode === null)) {
      if (lastNode.level < node.level) {
        lastNode.children.push(node)
        node.parent = lastNode
      } else if (lastNode.level === node.level) {
        const parent = lastNode.parent
        if (parent !== null) {
          parent.children.push(node)
          node.parent = parent
        }
      } else {
        const parents = this.nodes.filter((n) => n.level < node.level)
        const parent = parents.length > 0 ? parents[parents.length - 1] : null
        if (parent !== null) {
          parent.children.push(node)
          node.parent = parent
        }
      }
    }
  }

  toSpec() {
    return this.nodes[0].toSpec()
  }
}

class Node {
  constructor(text) {
    this.text = text
    this.parent = null
    this.children = []

    this.spaces = null
    this.symbol = null
    this.body = null

    this.level = 0
    this.indent = 0

    this.parse()
  }

  parse() {
    let matched = this.text.match(/^([ ]*)-[ ]*((.+):)?[ ]*(.+)$/)
    if (matched) {
      this.spaces = matched[1]
      this.symbol = matched[3]
      this.body = matched[4]
      this.level = this.spaces.length / 4
      this.indent = ' '.repeat(this.level * 2)
      return
    }

    matched = this.text.match(/^([ ]*)(.+)$/)
    if (matched) {
      this.spaces = matched[1]
      this.body = matched[2]
      this.level = this.spaces.length / 4
      this.indent = ' '.repeat(this.level * 2)
    }
  }

  decoratedText() {
    switch (this.symbol) {
      case 'd':
        return `describe '${this.body}' do`
      case 'c':
        return `context '${this.body}' do`
      case 'i':
        return `xit '${this.body}' do`
      default:
        return `# ${this.body}`
    }
  }

  terminalSymbol() {
    return 'end'
  }

  isComment() {
    return this.symbol == null
  }

  toSpec() {
    return [
      this.indent + this.decoratedText(),
      this.children.map((c) => c.toSpec()),
      this.isComment() ? null : this.indent + this.terminalSymbol()
    ]
      .flat(10)
      .filter((e) => e !== null)
      .join('\n')
  }
}
