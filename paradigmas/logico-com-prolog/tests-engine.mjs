import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const source = await readFile(new URL('./engine.js', import.meta.url), 'utf8');
const { runProlog } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
let tests = 0;
function answers(program, query, expected, options) {
  const result = runProlog(program, query, options);
  assert.equal(result.error, undefined, JSON.stringify(result));
  assert.deepEqual(result.solutions.map(s => s.bindings), expected, query);
  tests++;
  return result;
}
answers('gosta(ana, cafe). gosta(bia, cha). gosta(caio, cafe).', 'gosta(X, cafe).', [{X:'ana'}, {X:'caio'}]);
answers('gosta(ana, cafe).', 'gosta(ana, cha).', []);
answers('pai(joao, ana). pai(ana, bia). avo(X,Y) :- pai(X,Z), pai(Z,Y).', 'avo(X, bia).', [{X:'joao'}]);
answers('', 'X = ponto(2, Y), Y = 3.', [{X:'ponto(2, 3)',Y:'3'}]);
answers('', 'X = [1,2|T], T = [3].', [{X:'[1, 2, 3]',T:'[3]'}]);
answers('', '[H|T] = [ana, bia, caio].', [{H:'ana',T:'[bia, caio]'}]);
answers('pertence(X,[X|_]). pertence(X,[_|T]) :- pertence(X,T).', 'pertence(X,[a,b,c]).', [{X:'a'},{X:'b'},{X:'c'}]);
answers('concatena([], L, L). concatena([H|T],L,[H|R]) :- concatena(T,L,R).', 'concatena([1,2],[3],R).', [{R:'[1, 2, 3]'}]);
answers('fatorial(0,1). fatorial(N,F) :- N > 0, N1 is N - 1, fatorial(N1,F1), F is N * F1.', 'fatorial(5,F).', [{F:'120'}]);
answers('', '(X = a ; X = b), X \\= b.', [{X:'a'}]);
answers('', 'X is 17 mod 5, Y is 2 ** 3, Z is 7 // 2.', [{X:'2',Y:'8',Z:'3'}]);
answers('ave(piu). voa(X) :- ave(X), \\+ impedido(X). impedido(tico).', 'voa(piu).', [{}]);
answers('cor(azul). cor(verde). primeira(X) :- cor(X), !. primeira(vermelho).', 'primeira(X).', [{X:'azul'}]);
answers('p(a). p(b). q(X) :- p(X), !, fail. q(c).', 'q(X).', []);
answers('p(a). p(b). q(X) :- p(X), !. r(1). r(2).', 'q(X), r(Y).', [{X:'a',Y:'1'},{X:'a',Y:'2'}]);
answers('', 'X = X.', [{X:'X'}]);
answers('', 'X = f(X).', []);
answers('', "X = 'Maria Silva'.", [{X:"'Maria Silva'"}]);
answers('', 'X is -3 + 8 * 2, X =:= 13.', [{X:'13'}]);
// A cut commits only the predicate that contains it; alternatives of its caller survive.
answers('p(a). p(b). inner(X) :- p(X), !. outer(X) :- inner(X). outer(c).', 'outer(X).', [{X:'a'},{X:'c'}]);
// Alternatives created after the cut remain available.
answers('p(a). p(b). q(1). q(2). choose(X,Y) :- p(X), !, q(Y).', 'choose(X,Y).', [{X:'a',Y:'1'},{X:'a',Y:'2'}]);
// Cut inside call/1 is opaque to the enclosing clause.
answers('p(a). p(b). q(X) :- p(X), call(!).', 'q(X).', [{X:'a'},{X:'b'}]);
// Conjunction distributes over disjunction and binding rollback preserves each branch.
answers('', '(X = a; X = b), (Y = 1; Y = 2).', [{X:'a',Y:'1'},{X:'a',Y:'2'},{X:'b',Y:'1'},{X:'b',Y:'2'}]);
answers('', '(X = a, fail; X = b).', [{X:'b'}]);
answers('', 'X = a; X = b, fail.', [{X:'a'}]);
// Unification extends an open tail, keeps sharing and rejects incompatible structures.
answers('', '[a,b|T] = [a|R], R = [b,c].', [{T:'[c]',R:'[b, c]'}]);
answers('', 'X = Y, Y = par(Z,Z), Z = a.', [{X:'par(a, a)',Y:'par(a, a)',Z:'a'}]);
answers('', 'f(X, X) = f(a, b).', []);
answers('', 'p(_, _) = p(a,b).', [{}]);
answers('', 'X = Y, var(X), var(Y).', [{X:'Y',Y:'Y'}]);
// Negation does not export bindings from its failed inner attempt.
answers('', '\\+ (X = a, fail), X = b.', [{X:'b'}]);
answers('', 'X = (1 + 2) * 3, Y = 8 - (3 - 1).', [{X:'(1 + 2) * 3',Y:'8 - (3 - 1)'}]);
answers('', 'X is -3, X = -3, number(-3).', [{X:'-3'}]);
answers('', 'X = (-2) ** 2, Y is -2 ** 2, Z is (-2) ** 2.', [{X:'(-2) ** 2',Y:'-4',Z:'4'}]);
answers('', 'X = f((a,b)), Y = [(a;b)].', [{X:'f((a , b))',Y:'[(a ; b)]'}]);
assert.match(runProlog('', 'X is Y + 1.').error, /variável/); tests++;
assert.match(runProlog('', 'nao_existe(x).').error, /desconhecido/); tests++;
assert.match(runProlog('p(a)', 'p(X).').error, /Esperado/); tests++;
const limit = runProlog('loop :- loop.', 'loop.', {maxDepth:10});
assert.equal(limit.truncated,true); assert.match(limit.error,/Limite/); tests++;
const bound = answers('p(a). p(b). p(c).', 'p(X).', [{X:'a'}], {maxSolutions:1});
assert.equal(bound.truncated,true);
const exact = answers('p(a).', 'p(X).', [{X:'a'}], {maxSolutions:1});
assert.equal(exact.truncated,false);
assert.match(runProlog('p([a, b).', 'p(X).').error, /Esperado/); tests++;
assert.match(runProlog('', 'p("texto").').error, /Símbolo/); tests++;
const steps = runProlog('repete :- repete.', 'repete.', {maxSteps:8, maxDepth:100});
assert.equal(steps.truncated,true); assert.ok(steps.steps <= 9); tests++;
const traceBound = answers('p(a). p(b).', 'p(X).', [{X:'a'},{X:'b'}], {maxTrace:3});
assert.equal(traceBound.trace.length,3); assert.equal(traceBound.traceTruncated,true);
console.log(`${tests} engine checks passed.`);

// Keep the published course examples compatible with the interpreter.
const lessonsSource = await readFile(new URL('./lessons.js', import.meta.url), 'utf8');
const { lessons } = await import(`data:text/javascript;base64,${Buffer.from(lessonsSource).toString('base64')}`);
let courseChecks = 0;
for (const lesson of lessons) {
  const main = runProlog(lesson.program, lesson.query);
  assert.equal(main.error, undefined, `${lesson.id}: ${main.error}`);
  assert.equal(main.truncated, false, lesson.id);
  assert.ok(main.solutions.length > 0, `${lesson.id}: main example must illustrate a proof`);
  courseChecks++;
  for (const preset of lesson.presets) {
    const example = runProlog(lesson.program, preset.query);
    if (lesson.id === 'aritmetica' && preset.label === 'Variável não instanciada') assert.match(example.error, /variável/);
    else assert.equal(example.error, undefined, `${lesson.id} / ${preset.label}: ${example.error}`);
    assert.equal(example.truncated, false, `${lesson.id} / ${preset.label}`);
    courseChecks++;
  }
}
console.log(`${courseChecks} course examples checked across ${lessons.length} chapters.`);
