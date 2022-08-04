let botaoAtualizar = document.getElementById(
  'atualizar-saldo'
) as HTMLButtonElement;
let botaoLimpar = document.getElementById('limpar-saldo') as HTMLButtonElement;
let soma = document.getElementById('soma') as HTMLInputElement;
let campoSaldo = document.getElementById('campo-saldo') as HTMLSpanElement;

let saldoAtual: number = 0;

function somarAoSaldo(soma: string): void {
  saldoAtual += Number(soma);
  campoSaldo.innerHTML = saldoAtual.toString();
}

function limparSaldo(): void {
  saldoAtual = 0;
  campoSaldo.innerHTML = '';
}

botaoAtualizar?.addEventListener('click', function (): void {
  somarAoSaldo(soma.value);
});

botaoLimpar?.addEventListener('click', function (): void {
  limparSaldo();
});
