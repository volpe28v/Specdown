export default function(markdown, render) {
  const st = new SpecTree()
  markdown.split('\n').forEach((line) => st.add(line))
  return st.toSpec(render)
}

class SpecTree {
  constructor() {
    this.nodes = [new RootNode()]
  }

  add(line) {
    const node = new Node(line)
    if (!node.parse()) return

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

  toSpec(render) {
    return this.nodes[0].toSpec(render)
  }
}

class RootNode {
  constructor() {
    this.children = []
  }

  get level() {
    return -1
  }

  toSpec(render) {
    return this.children.map((c) => c.toSpec(render)).join('\n')
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
  }

  parse() {
    const matched = this.text.match(/^([ ]*)-(([^:\n]+?):)?(.*)$/)
    if (matched) {
      this.spaces = matched[1]
      this.symbol = matched[3] ? matched[3].trim() : null
      this.body = matched[4].trim()
      return true
    } else {
      return false
    }
  }

  get level() {
    return this.spaces.length / 4
  }

  get indent() {
    return ' '.repeat(this.level * 2)
  }

  toSpec(render) {
    return this.specTextArray(render).join('\n')
  }

  specTextArray(render) {
    const specText = render.symbols[this.symbol]
    if (specText) {
      return [
        this.indent + specText(this.body),
        ...this.children.map((c) => c.toSpec(render)),
        this.indent + render.terminal
      ]
    } else {
      return [
        this.indent + render.comment(this.body),
        ...this.children.map((c) => c.toSpec(render))
      ]
    }
  }
}
