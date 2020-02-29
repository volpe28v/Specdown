export default [
  {
    name: 'rspec',
    symbols: {
      d: (body) => `describe '${body}' do`,
      c: (body) => `context '${body}' do`,
      i: (body) => `xit '${body}' do`,
      b: (body) => `before do ${body.length !== 0 ? '# ' + body : ''}`
    },
    comment: (body) => `# ${body}`,
    terminal: 'end'
  },
  {
    name: 'jest',
    symbols: {
      d: (body) => `describe('${body}', () => {`,
      c: (body) => `describe('${body}', () => {`,
      i: (body) => `it('${body}', () => {`,
      b: (body) => `beforeEach(() => { ${body.length !== 0 ? '// ' + body : ''}`
    },
    comment: (body) => `// ${body}`,
    terminal: '})'
  }
]
