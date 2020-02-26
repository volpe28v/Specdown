export default function(markdown, render) {
  const st = new SpecTree(render)
  markdown.split('\n').forEach((line) => st.add(line))
  return st.toSpec()
}

class SpecTree {
  constructor(specRender) {
    this.nodes = [new RootNode()]
    this.specRender = specRender
  }

  add(line) {
    const node = new Node(line, this.specRender)
    if (node.isEmpty()) return

    const lastNode = this.nodes[this.nodes.length - 1]
    this.nodes.push(node)

    if (lastNode.level < node.level) {
      lastNode.children.push(node)
      node.parent = lastNode
    } else if (lastNode.level === node.level) {
      const parent = lastNode.parent
      parent.children.push(node)
      node.parent = parent
    } else {
      const parents = this.nodes.filter((n) => n.level < node.level)
      const parent = parents.length > 0 ? parents[parents.length - 1] : null
      parent.children.push(node)
      node.parent = parent
    }
  }

  toSpec() {
    return this.nodes[0].toSpec()
  }
}

class RootNode {
  constructor() {
    this.children = []
    this.level = -1
  }

  toSpec() {
    return this.children.map((c) => c.toSpec()).join('\n')
  }
}

class Node {
  constructor(text, specRender) {
    this.text = text
    this.specRender = specRender
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

    matched = this.text.match(/^([ ]*)(.*)$/)
    if (matched) {
      this.spaces = matched[1]
      this.body = matched[2]
      this.level = this.spaces.length / 4
      this.indent = ' '.repeat(this.level * 2)
    }
  }

  decoratedText() {
    const specText = this.specRender.symbols[this.symbol]
    if (specText) {
      return specText(this.body)
    } else {
      return this.specRender.comment(this.body)
    }
  }

  terminalSymbol() {
    return this.specRender.terminal
  }

  isEmpty() {
    return this.body.length === 0
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
