export interface Pagina<T> {
  itens: T[];
  totalPaginas: number;
  totalRegistros: number;
  paginaAtual: number;
}