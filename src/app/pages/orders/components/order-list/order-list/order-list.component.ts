import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Order } from '../../../interfaces/order.interface';
import { OrderService } from '../../../services/order.service';
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
import { OrderDetail } from '../../../interfaces/orderDetail.interface';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
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
    DialogModule
  ]
})

export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  pedidoSelecionado: OrderDetail | null = null;
  detalheVisivel = false;

  paginaAtual = 1;
  tamanhoPagina = 10;
  totalPaginas = 0;
  totalRegistros = 0;

  constructor(private orderService: OrderService) { }

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

  onGlobalFilter(table: any, event: Event) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }

  aoPaginar(event: any) {
    const pagina = event.first / event.rows + 1;
    const tamanho = event.rows;

    this.paginaAtual = pagina;
    this.tamanhoPagina = tamanho;

    this.carregarPedidos();
  }

  selectedOrder: Order | null = null;
  exibindoDetalhes = false;
  exibindoEdicao = false;

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

  editarPedido(order: Order) {
    this.selectedOrder = order;
    this.exibindoEdicao = true;
  }

  excluirPedido(order: Order) {
    if (confirm(`Tem certeza que deseja excluir o pedido #${order.id}?`)) {
    }
  }


}
