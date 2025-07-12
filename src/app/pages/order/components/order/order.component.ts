import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { Order } from '../../interfaces/IOrder.interface';
import { OrderDetail } from '../../interfaces/IOrderDetail.interface';
import { OrderService } from '../../services/order.service';
import { OrderCreate } from '../../interfaces/IOrderCreate.interface';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../interfaces/ICustomer.interface';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/IProduct.interface';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-order-list',
  templateUrl: './order.component.html',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    SliderModule,
    ProgressBarModule,
    TagModule,
    DialogModule,
    DropdownModule,
    InputNumberModule,
    ToastModule
  ],
  providers: [MessageService]
})

export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  clientes: Customer[] = [];
  mensagensErro: string[] = [];
  produtos: Product[] = [];

  novoPedido: OrderCreate = {
    customerId: 0,
    items: []
  }

  criandoPedido = false;
  loading = true;
  pedidoSelecionado: OrderDetail | null = null;
  detalheVisivel = false;

  paginaAtual = 1;
  tamanhoPagina = 10;
  totalPaginas = 0;
  totalRegistros = 0;
  selectedOrder: Order | null = null;
  exibindoDetalhes = false;
  exibindoEdicao = false;
  editandoPedidoId: number | null = null;

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.loading = true;
    this.orderService.getAll(this.paginaAtual, this.tamanhoPagina).subscribe({
      next: (data) => {
        this.orders = data.itens;
        this.totalPaginas = data.totalPaginas;
        this.totalRegistros = data.totalRegistros;
        this.paginaAtual = data.paginaAtual;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  carregarClientes() {
    this.customerService.getAll().subscribe({
      next: (res) => {
        this.clientes = res;
      },
      error: () => this.clientes = []
    });
  }

  carregarProdutos() {
    this.productService.getAll().subscribe({
      next: (res) => this.produtos = res,
      error: () => this.produtos = []
    });
  }

  abrirCriarPedido() {
    this.carregarClientes();
    this.carregarProdutos();
    this.resetarFormulario();
    this.criandoPedido = true;
  }



  resetarFormulario() {
    this.novoPedido = {
      customerId: 0,
      items: [{ productId: 0, quantity: 1 }]
    };
    this.mensagensErro = [];
  }

  adicionarItem() {
    const disponiveis = this.produtosDisponiveis(-1);

    if (disponiveis.length === 0) {
      if (!this.mensagensErro.includes('Todos os produtos já foram adicionados.')) {
        this.mensagensErro.push('Todos os produtos já foram adicionados.');
      }
      return;
    }

    this.novoPedido.items.push({ productId: 0, quantity: 1 });

    this.removerErro('Todos os produtos já foram adicionados.');
  }


  removerItem(index: number) {
    this.novoPedido.items.splice(index, 1);

    const aindaHaProdutosDisponiveis = this.produtosDisponiveis(-1).length > 0;

    if (aindaHaProdutosDisponiveis) {
      this.removerErro('Todos os produtos já foram adicionados.');
    }
  }
  bloquearTeclasInvalidas(event: KeyboardEvent) {
    const teclasProibidas = ['-', '+', 'e', 'E'];
    if (teclasProibidas.includes(event.key)) {
      event.preventDefault();
    }
  }

  bloquearColagemInvalida(event: ClipboardEvent) {
    const valorColado = event.clipboardData?.getData('text') || '';
    if (!/^\d+$/.test(valorColado)) {
      event.preventDefault();
    }
  }

  corrigirQuantidadeInvalida(index: number) {
    const item = this.novoPedido.items[index];
    if (!item.quantity || item.quantity < 1) {
      item.quantity = 1;
    }
  }

  removerErro(erro: string) {
    const index = this.mensagensErro.indexOf(erro);
    if (index !== -1) {
      this.mensagensErro.splice(index, 1);
    }
  }

  produtosDisponiveis(indexAtual: number): Product[] {
    const produtosSelecionados = this.novoPedido.items
      .filter((_, index) => index !== indexAtual)
      .map(item => item.productId);

    return this.produtos.filter(p => !produtosSelecionados.includes(p.id));
  }

  salvarPedido() {
    this.mensagensErro = [];

    const payload = this.novoPedido;

    const requisicao$ = this.editandoPedidoId
      ? this.orderService.put(this.editandoPedidoId, payload)
      : this.orderService.post(payload);

    requisicao$.subscribe({
      next: (pedido: OrderDetail | null) => {
        if (!pedido) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'A operação não retornou um resultado válido.',
            life: 3000
          });
          return;
        }

        const acao = this.editandoPedidoId ? 'atualizado' : 'criado';

        this.messageService.add({
          severity: 'success',
          summary: `Pedido ${acao} com sucesso`,
          detail: `Pedido #${pedido.id}`,
          life: 3000
        });

        this.carregarPedidos();
        this.criandoPedido = false;
        this.resetarFormulario();
      },
      error: (error) => {
        if (error.error && Array.isArray(error.error.erros)) {
          this.mensagensErro = error.error.erros;
        } else {
          this.mensagensErro = ['Erro inesperado ao salvar pedido.'];
        }
      }
    });
  }


  editarPedido(order: Order) {
    this.orderService.getById(order.id).subscribe({
      next: (pedido: OrderDetail) => {
        this.novoPedido = {
          customerId: pedido.customerId,
          items: pedido.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        };

        this.editandoPedidoId = pedido.id;
        this.carregarClientes();
        this.carregarProdutos();
        this.criandoPedido = true;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao carregar pedido',
          detail: 'Não foi possível carregar os dados para edição.',
          life: 3000
        });
      }
    });
  }


  verDetalhes(id: number) {
    this.orderService.getById(id).subscribe({
      next: (res) => {
        this.pedidoSelecionado = res;
        this.detalheVisivel = true;
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes do pedido:', err);
      }
    });
  }

  excluirPedido(order: Order) {
    if (confirm(`Tem certeza que deseja excluir o pedido #${order.id}?`)) {
    }
  }

  aoPaginar(event: any) {
    const pagina = event.first / event.rows + 1;
    const tamanho = event.rows;

    this.paginaAtual = pagina;
    this.tamanhoPagina = tamanho;

    this.carregarPedidos();
  }

  onGlobalFilter(table: any, event: Event) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }
}
