export default [
  {
    name: 'rspec',
    format: 'ruby',
    symbols: {
      d: (body) => `describe '${body}' do`,
      c: (body) => `context '${body}' do`,
      i: (body) => `xit '${body}' do`,
      b: (body) => `before do ${body.length !== 0 ? '# ' + body : ''}`,
      a: (body) => `after do ${body.length !== 0 ? '# ' + body : ''}`
    },
    comment: (body) => `# ${body}`,
    terminal: 'end'
  },
  {
    name: 'jest',
    format: 'javascript',
    symbols: {
      d: (body) => `describe('${body}', () => {`,
      c: (body) => `describe('${body}', () => {`,
      i: (body) => `it('${body}', () => {`,
      b: (body) =>
        `beforeEach(() => { ${body.length !== 0 ? '// ' + body : ''}`,
      a: (body) => `afterEach(() => { ${body.length !== 0 ? '// ' + body : ''}`
    },
    comment: (body) => `// ${body}`,
    terminal: '})'
  },
  {
    name: 'ScalaTest - Spec',
    format: 'scala',
    symbols: {
      d: (body) => `describe("${body}") {`,
      c: (body) => `describe("${body}") {`,
      i: (body) => `it("${body}") {`,
      b: (body) => `before { ${body.length !== 0 ? '// ' + body : ''}`,
      a: (body) => `after { ${body.length !== 0 ? '// ' + body : ''}`
    },
    comment: (body) => `// ${body}`,
    terminal: '}'
  },
  {
    name: 'ScalaTest - FlatSpec',
    format: 'scala',
    symbols: {
      i: (body) => `it should "${body}" in {`,
      b: (body) => `before { ${body.length !== 0 ? '// ' + body : ''}`,
      a: (body) => `after { ${body.length !== 0 ? '// ' + body : ''}`
    },
    comment: (body) => `// ${body}`,
    terminal: '}'
  }
]
