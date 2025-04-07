// filepath: c:\Users\user\Documents\Pruebas_Tecnicas\tru-test\client\src\store\index.ts
import { defineStore } from 'pinia';
import apiService from '../utils/api-service';
import type { Stock } from '../models/stock.model';

export const useStockStore = defineStore('stock', {
  state: () => ({
    stocks: [] as Stock[],
    total: 0,
    page: 1,
    pageSize: 10,
    isRecomendation: false,
    isUpdate: false,
  }),
  actions: {
    async updateStocks() {
      try {
        this.isUpdate = true;
        const { data } = await apiService.get(`/api/data`);
        
        this.stocks = data.data.stocks;
        this.total = data.data.total;
      } catch (error) {
        throw(error);
      } finally {
        this.isUpdate = false;
      }
    },
    async fetchStocks() {
      try {
        const { data } = this.isRecomendation 
          ? await apiService.get(`/stock/recommendations?page=${this.page}&size=${this.pageSize}`)
          : await apiService.get(`/stock/all?page=${this.page}&size=${this.pageSize}`);
        
        this.stocks = data.data.stocks;
        this.total = data.data.total;
      } catch (error) {
        throw(error);
      }
    },
    toggleRecomendation() {
      this.isRecomendation = !this.isRecomendation;
      this.page = 1;
      this.fetchStocks();
    },
    onPageChange(newPage: number) {
      this.page = newPage;
      this.fetchStocks();
    }
  }
});