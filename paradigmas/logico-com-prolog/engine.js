/* A small, deterministic Prolog interpreter for the teaching laboratory.
 * No eval, network, JavaScript callbacks or file-system predicates are exposed.
 * Terms: atoms, numbers, variables, structures, lists. Resolution: left-to-right,
 * depth-first, clause order, fresh variables, unification with occurs check.
 */
const atom = name => ({ kind: 'atom', name });
const num = value => ({ kind: 'number', value });
const compound = (name, args) => ({ kind: 'compound', name, args });
let variableSerial = 0;
const variable = name => ({ kind: 'variable', name, id: ++variableSerial });
const infix = { ';': 1, ',': 2, '=': 3, '\\=': 3, '==': 3, '\\==': 3, is: 3, '<': 3, '>': 3, '=<': 3, '>=': 3, '=:=': 3, '=\\=': 3, '+': 4, '-': 4, '*': 5, '/': 5, '//': 5, mod: 5, '**': 6 };

function tokenize(source) {
  const tokens = [];
  let index = 0;
  while (index < source.length) {
    const rest = source.slice(index);
    const ignored = /^(?:\s+|%[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)/.exec(rest);
    if (ignored) { index += ignored[0].length; continue; }
    const token = /^(?:'(?:''|\\.|[^'\\])*'|\d+(?:\.\d+)?|[A-Za-z_][A-Za-z_0-9]*|=\\=|=:=|\\==|:-|\?-|\\\+|\\=|==|>=|=<|\/\/|\*\*|[()[\],;.|!+*\/=<>-])/.exec(rest);
    if (!token) throw new Error(`Símbolo não reconhecido perto de “${rest.slice(0, 22)}”.`);
    tokens.push(token[0]); index += token[0].length;
  }
  return tokens;
}

class Parser {
  constructor(source) { this.tokens = tokenize(source); this.pos = 0; this.vars = new Map(); }
  peek() { return this.tokens[this.pos]; }
  accept(token) { if (this.peek() === token) { this.pos++; return true; } return false; }
  expect(token) { if (!this.accept(token)) throw new Error(`Esperado “${token}”; encontrado “${this.peek() ?? 'fim do texto'}”.`); }
  expr(min = 1) {
    let left = this.primary();
    while ((infix[this.peek()] ?? 0) >= min) {
      const op = this.tokens[this.pos++];
      left = compound(op, [left, this.expr(infix[op] + (op === '**' ? 0 : 1))]);
    }
    return left;
  }
  primary() {
    const token = this.tokens[this.pos++];
    if (token === undefined) throw new Error('Expressão incompleta.');
    if (token === '(') { const value = this.expr(); this.expect(')'); return value; }
    if (token === '\\+') return compound('\\+', [this.expr(3)]);
    if (token === '-' || token === '+') {
      const value = this.expr(6);
      return value.kind === 'number' ? num(token === '-' ? -value.value : value.value) : compound(token, [value]);
    }
    if (token === '[') {
      if (this.accept(']')) return atom('[]');
      const items = [this.expr(3)];
      while (this.accept(',')) items.push(this.expr(3));
      let tail = this.accept('|') ? this.expr(3) : atom('[]');
      this.expect(']');
      for (let i = items.length - 1; i >= 0; i--) tail = compound('.', [items[i], tail]);
      return tail;
    }
    if (/^[A-Z_]/.test(token)) {
      if (token === '_') return variable('_');
      if (!this.vars.has(token)) this.vars.set(token, variable(token));
      return this.vars.get(token);
    }
    if (/^\d/.test(token)) return num(Number(token));
    if (!/^(?:[a-z][A-Za-z_0-9]*|'|!)/.test(token)) throw new Error(`Termo inesperado: “${token}”.`);
    const name = token[0] === "'" ? token.slice(1, -1).replace(/''/g, "'").replace(/\\'/g, "'") : token;
    if (!this.accept('(')) return atom(name);
    const args = [this.expr(3)];
    while (this.accept(',')) args.push(this.expr(3));
    this.expect(')'); return compound(name, args);
  }
  program() {
    const clauses = [];
    while (this.peek() !== undefined) {
      this.vars = new Map();
      const head = this.expr(3);
      if (!['atom', 'compound'].includes(head.kind)) throw new Error('A cabeça de uma cláusula precisa ser um predicado.');
      const body = this.accept(':-') ? this.expr() : atom('true');
      this.expect('.'); clauses.push({ head, body, line: clauses.length + 1 });
    }
    return clauses;
  }
  query() {
    this.accept('?-');
    const result = this.expr(); this.accept('.');
    if (this.peek() !== undefined) throw new Error(`Texto extra na consulta: “${this.peek()}”.`);
    return result;
  }
}

function deref(term, env) {
  while (term.kind === 'variable' && env.has(term.id)) term = env.get(term.id);
  return term;
}
function occurs(id, term, env) {
  term = deref(term, env);
  return term.kind === 'variable' ? term.id === id : term.kind === 'compound' && term.args.some(arg => occurs(id, arg, env));
}
function unify(left, right, original) {
  const env = new Map(original), pending = [[left, right]];
  while (pending.length) {
    let [a, b] = pending.pop(); a = deref(a, env); b = deref(b, env);
    if (a.kind === 'variable' && b.kind === 'variable' && a.id === b.id) continue;
    if (a.kind === 'variable') { if (occurs(a.id, b, env)) return null; env.set(a.id, b); continue; }
    if (b.kind === 'variable') { if (occurs(b.id, a, env)) return null; env.set(b.id, a); continue; }
    if (a.kind !== b.kind) return null;
    if (a.kind === 'number') { if (a.value !== b.value) return null; }
    else if (a.name !== b.name) return null;
    else if (a.kind === 'compound') {
      if (a.args.length !== b.args.length) return null;
      a.args.forEach((arg, i) => pending.push([arg, b.args[i]]));
    }
  }
  return env;
}
function fresh(term, names = new Map()) {
  if (term.kind === 'variable') {
    if (!names.has(term.id)) names.set(term.id, variable(term.name));
    return names.get(term.id);
  }
  return term.kind === 'compound' ? compound(term.name, term.args.map(arg => fresh(arg, names))) : term;
}
function show(term, env = new Map(), seen = new Map()) {
  term = deref(term, env);
  if (term.kind === 'number') return String(term.value);
  if (term.kind === 'variable') { if (!seen.has(term.id)) seen.set(term.id, term.name === '_' ? `_G${seen.size + 1}` : term.name); return seen.get(term.id); }
  if (term.kind === 'atom') return term.name === '[]' || term.name === '!' || /^[a-z][\w]*$/.test(term.name) ? term.name : `'${term.name.replace(/'/g, "''")}'`;
  const argument = arg => {
    const child = deref(arg, env), text = show(child, env, seen);
    return child.kind === 'compound' && (child.name === ',' || child.name === ';') ? `(${text})` : text;
  };
  if (term.name === '.') {
    const items = []; let cursor = term;
    while (cursor.kind === 'compound' && cursor.name === '.' && cursor.args.length === 2) {
      items.push(argument(cursor.args[0])); cursor = deref(cursor.args[1], env);
    }
    return `[${items.join(', ')}${cursor.kind === 'atom' && cursor.name === '[]' ? '' : ` | ${argument(cursor)}`}]`;
  }
  if (term.name in infix && term.args.length === 2) {
    const operand = (arg, side) => {
      const child = deref(arg, env), rendered = show(child, env, seen);
      const precedence = child.kind === 'number' && child.value < 0 ? 6 : child.kind === 'compound' ? child.args.length === 2 ? infix[child.name] : child.args.length === 1 && (child.name === '+' || child.name === '-') ? 6 : undefined : undefined;
      // Preserve the actual term structure: (1+2)*3 and 1+(2*3) are different terms.
      const needsParens = precedence !== undefined && (precedence < infix[term.name] || precedence === infix[term.name] && (term.name === '**' ? side === 'left' : side === 'right'));
      return needsParens ? `(${rendered})` : rendered;
    };
    return `${operand(term.args[0], 'left')} ${term.name} ${operand(term.args[1], 'right')}`;
  }
  if (term.name === '\\+') return `\\+ (${show(term.args[0], env, seen)})`;
  return `${term.name}(${term.args.map(argument).join(', ')})`;
}
function arithmetic(term, env) {
  term = deref(term, env);
  if (term.kind === 'number') return term.value;
  if (term.kind === 'variable') throw new Error('Aritmética: uma variável ainda não recebeu valor. “is” calcula a expressão à direita; não resolve equações.');
  if (term.kind !== 'compound') throw new Error(`“${show(term, env)}” não é uma expressão numérica.`);
  const a = arithmetic(term.args[0], env), b = term.args.length === 2 ? arithmetic(term.args[1], env) : undefined;
  let value;
  switch (term.name) {
    case '+': value = b === undefined ? a : a + b; break;
    case '-': value = b === undefined ? -a : a - b; break;
    case '*': value = a * b; break;
    case '/': value = a / b; break;
    case '//': value = Math.trunc(a / b); break;
    case 'mod': value = ((a % b) + b) % b; break;
    default:
      if (term.name === 'mod') value = ((a % b) + b) % b;
      else if (term.name === '**') value = a ** b;
      else throw new Error(`Operação numérica não suportada: ${term.name}.`);
  }
  if (!Number.isFinite(value)) throw new Error('Resultado aritmético inválido (por exemplo, divisão por zero).');
  return value;
}

/** Run a bounded query. All displayed terms are plain text, never HTML.
 * options: maxSteps (default 4000), maxDepth (70), maxSolutions (30), maxTrace (1000).
 * Result: {solutions:[{bindings:{Name:string}}],trace:[{id,parentId,type,goal,
 * depth,detail,clause?}],steps,truncated,traceTruncated,error?}.
 */
export function runProlog(program, query, options = {}) {
  const bounded = (key, fallback, ceiling) => Math.max(1, Math.min(ceiling, Number(options[key]) || fallback));
  const limits = { steps: bounded('maxSteps', 4000, 15000), depth: bounded('maxDepth', 70, 150), solutions: bounded('maxSolutions', 30, 100), trace: bounded('maxTrace', 1000, 5000) };
  const result = { solutions: [], trace: [], steps: 0, truncated: false, traceTruncated: false };
  let eventId = 0;
  const log = (type, goal, depth, detail, parentId, extra = {}) => {
    const id = ++eventId;
    if (result.trace.length < limits.trace) result.trace.push({ id, parentId, type, goal, depth, detail, ...extra });
    else result.traceTruncated = true;
    return id;
  };
  const tick = depth => {
    if (++result.steps > limits.steps || depth > limits.depth) {
      result.truncated = true; throw new Error('Limite didático de busca atingido. Reduza a consulta ou acrescente um caso base.');
    }
  };
  try {
    if (program.length > 50000 || query.length > 5000) throw new Error('Programa ou consulta muito grande para este laboratório.');
    const clauses = new Parser(program).program();
    const parser = new Parser(query), target = parser.query(), queryVars = parser.vars;
    const key = term => `${term.name}/${term.kind === 'compound' ? term.args.length : 0}`;
    const index = new Map();
    for (const clause of clauses) {
      const pred = key(clause.head); if (!index.has(pred)) index.set(pred, []); index.get(pred).push(clause);
    }
    const bindingText = env => Object.fromEntries([...queryVars].filter(([name]) => !name.startsWith('_')).map(([name, term]) => [name, show(term, env)]));
    function* resolve(goals, env, depth, scope, parentId = null) {
      tick(depth);
      if (!goals.length) { yield env; return; }
      const [original, ...rest] = goals, goal = deref(original, env);
      if (goal.kind === 'variable') throw new Error('Não é possível executar uma variável sem valor como objetivo.');
      if (goal.kind === 'number') throw new Error('Um número não pode ser executado como predicado.');
      if (goal.name === ',' && goal.args?.length === 2) { yield* resolve([...goal.args, ...rest], env, depth, scope, parentId); return; }
      const epoch = scope.epoch, label = show(goal, env);
      const callId = log('call', label, depth, 'Tentar provar este objetivo.', parentId);
      let passed = false;
      function* continuation(nextEnv, detail, extra) {
        if (!nextEnv) return;
        passed = true;
        log('match', show(goal, nextEnv), depth, detail, callId, { bindings: bindingText(nextEnv), ...extra });
        yield* resolve(rest, nextEnv, depth, scope, parentId);
      }
      const args = goal.args ?? [], name = goal.name;
      if (name === ';' && args.length === 2) {
        for (const branch of args) {
          for (const next of resolve([branch], env, depth + 1, scope, callId)) {
            yield* continuation(next, 'Uma alternativa foi satisfeita.');
            if (scope.epoch !== epoch) break;
          }
          if (scope.epoch !== epoch) break;
        }
      } else if (name === 'true' && args.length === 0) yield* continuation(env, 'Verdadeiro.');
      else if ((name === 'fail' || name === 'false') && args.length === 0) { /* explicit failure */ }
      else if (name === '!' && args.length === 0) {
        scope.epoch++; yield* continuation(env, 'Corte: descarta alternativas criadas desde a entrada nesta regra.');
      } else if (name === '=' && args.length === 2) yield* continuation(unify(args[0], args[1], env), 'Os termos unificam.');
      else if (name === '\\=' && args.length === 2) {
        if (!unify(args[0], args[1], env)) yield* continuation(env, 'Os termos não unificam nesta consulta.');
      } else if ((name === '==' || name === '\\==') && args.length === 2) {
        const identical = (a, b) => {
          a = deref(a, env); b = deref(b, env);
          return a.kind === b.kind && (a.kind === 'variable' ? a.id === b.id : a.kind === 'number' ? a.value === b.value : a.name === b.name && (a.kind !== 'compound' || a.args.length === b.args.length && a.args.every((x, i) => identical(x, b.args[i]))));
        };
        if (identical(...args) === (name === '==')) yield* continuation(env, 'Comparação de identidade dos termos.');
      } else if (name === 'is' && args.length === 2) {
        const value = arithmetic(args[1], env);
        yield* continuation(unify(args[0], num(value), env), `A expressão à direita vale ${value}.`);
      } else if (['<', '>', '=<', '>=', '=:=', '=\\='].includes(name) && args.length === 2) {
        const a = arithmetic(args[0], env), b = arithmetic(args[1], env);
        const success = { '<': a < b, '>': a > b, '=<': a <= b, '>=': a >= b, '=:=': a === b, '=\\=': a !== b }[name];
        if (success) yield* continuation(env, `A comparação ${a} ${name} ${b} é verdadeira.`);
      } else if (name === '\\+' && args.length === 1) {
        const probe = resolve([args[0]], env, depth + 1, { epoch: 0 }, callId);
        const attempt = probe.next(); probe.return();
        if (attempt.done) yield* continuation(env, 'O objetivo interno falhou; a negação por falha tem sucesso.');
      } else if (['var', 'nonvar', 'atom', 'number', 'integer'].includes(name) && args.length === 1) {
        const term = deref(args[0], env);
        if ({ var: term.kind === 'variable', nonvar: term.kind !== 'variable', atom: term.kind === 'atom', number: term.kind === 'number', integer: term.kind === 'number' && Number.isInteger(term.value) }[name]) yield* continuation(env, `Teste ${name}/1 satisfeito.`);
      } else if (name === 'call' && args.length === 1) {
        for (const next of resolve([args[0]], env, depth + 1, { epoch: 0 }, callId)) {
          yield* continuation(next, 'O objetivo passado a call/1 foi satisfeito.');
          if (scope.epoch !== epoch) break;
        }
      } else {
        const candidates = index.get(key(goal));
        if (!candidates) throw new Error(`Predicado desconhecido: ${key(goal)}. Defina suas cláusulas na base de conhecimento.`);
        const childScope = { epoch: 0 };
        for (const clause of candidates) {
          tick(depth);
          const vars = new Map(), head = fresh(clause.head, vars), body = fresh(clause.body, vars);
          const next = unify(goal, head, env);
          if (!next) continue;
          log('rule', show(goal, next), depth, `Selecionada a cláusula ${clause.line}.`, callId, { clause: show(clause.head) + (clause.body.name === 'true' ? '.' : ` :- ${show(clause.body)}.`), clauseIndex: clause.line, bindings: bindingText(next) });
          for (const solved of resolve([body], next, depth + 1, childScope, callId)) {
            yield* continuation(solved, 'Todos os objetivos desta cláusula foram satisfeitos.', { clauseIndex: clause.line });
            if (scope.epoch !== epoch) break;
          }
          if (childScope.epoch > 0 || scope.epoch !== epoch) break;
          log('redo', label, depth, 'Voltar e procurar outra cláusula compatível (backtracking).', callId);
        }
      }
      log(passed ? 'exit' : 'fail', label, depth, passed ? 'Objetivo satisfeito; alternativas deste caminho encerradas.' : 'Nenhuma alternativa satisfez este objetivo. Voltar ao ponto de escolha.', callId);
    }
    const generator = resolve([target], new Map(), 0, { epoch: 0 });
    while (true) {
      const item = generator.next();
      if (item.done) break;
      const bindings = bindingText(item.value);
      result.solutions.push({ bindings });
      log('solution', show(target, item.value), 0, Object.keys(bindings).length ? Object.entries(bindings).map(([k, v]) => `${k} = ${v}`).join(', ') : 'true', null, { bindings });
      if (result.solutions.length >= limits.solutions) {
        // Probe once so a query with exactly N answers is not falsely marked incomplete.
        const extra = generator.next(); result.truncated = !extra.done; generator.return(); break;
      }
    }
  } catch (error) { result.error = error.message || String(error); }
  return result;
}

export const PROLOG_SUPPORT = Object.freeze({
  supported: ['fatos e regras', 'variáveis e unificação', 'estruturas e listas', 'recursão', 'conjunção e disjunção', 'backtracking', 'aritmética e comparações', 'negação por falha', 'corte (!)', 'call/1 e testes de tipo'],
  limits: 'Subconjunto educacional de Prolog, com occurs check. Não inclui módulos, strings, I/O, assert/retract, DCGs, bibliotecas prontas nem todos os predicados ISO. Defina pertence/2, concatenar/3 e outros predicados no editor. A busca é limitada para preservar a resposta do navegador.'
});
