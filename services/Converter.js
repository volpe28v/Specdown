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

  toSpec(render) {
    return this.nodes[0].toSpec(render)
  }
}

class RootNode {
  constructor() {
    this.children = []
    this.level = -1
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

    this.level = 0
    this.indent = 0

    this.parse()
  }

  parse() {
    if (this.parseAsSpecElement()) return
    this.parseAsComment()
  }

  parseAsSpecElement() {
    const matched = this.text.match(/^([ ]*)-[ ]*((.+):)?(.*)$/)
    if (matched) {
      this.spaces = matched[1]
      this.symbol = matched[3]
      this.body = matched[4].trim()
      this.level = this.spaces.length / 4
      this.indent = ' '.repeat(this.level * 2)
      return true
    } else {
      return false
    }
  }

  parseAsComment() {
    const matched = this.text.match(/^([ ]*)(.+)$/)
    if (matched) {
      this.spaces = matched[1]
      this.body = matched[2].trim()
      this.symbol = 'comment'
      this.level = this.spaces.length / 4
      this.indent = ' '.repeat(this.level * 2)
      return true
    } else {
      return false
    }
  }

  isEmpty() {
    return this.symbol === null
  }

  toSpec(render) {
    return [
      this.indent + this.decoratedText(render),
      this.children.map((c) => c.toSpec(render)),
      this.isComment(render) ? null : this.indent + this.terminalSymbol(render)
    ]
      .flat(10)
      .filter((e) => e !== null)
      .join('\n')
  }

  decoratedText(render) {
    const specText = render.symbols[this.symbol]
    if (specText) {
      return specText(this.body)
    } else {
      return render.comment(this.body)
    }
  }

  terminalSymbol(render) {
    return render.terminal
  }

  isComment(render) {
    return render.symbols[this.symbol] == null
  }
}
