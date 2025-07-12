export interface Resultado<T> {
  sucesso: boolean;
  contemErros: boolean;
  erros: string[];
  valor: T;
}