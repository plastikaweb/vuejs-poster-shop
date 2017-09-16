var PRICE = 9.99;
var PAG = 10;

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    search: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE
  },
  computed: {
    noMoreItens: function() {
      return        this.items.length === this.results.length && this.results.length > 0;
    }
  },
  methods: {
    appendItems: function() {
      if (this.items.length < this.results.length) {
        var append = this.results.slice(
          this.items.length,
          this.items.length + PAG
        );
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function() {
      if (this.search.length) {
        this.items = [];
        this.loading = true;
        this.$http.get('/search/'.concat(this.search)).then(
          function(res) {
            this.lastSearch = this.search;
            this.results = res.data;
            this.appendItems();
            this.loading = false;
          },
          function(err) {}
        );
      }
    },
    addItem: function(index) {
      var item = this.items[index];
      this.total += this.price;
      var found = false;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          found = true;
          this.cart[i].qty++;
          break;
        }
      }
      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: this.price
        });
      }
    },
    inc(item) {
      item.qty++;
      this.total += item.price;
    },
    dec(item) {
      item.qty--;
      this.total -= item.price;
      if (item.qty <= 0) {
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    }
  },
  filters: {
    currency: function(price) {
      return '$'.concat(price.toFixed(2));
    }
  },
  mounted: function() {
    var vue = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function() {
      vue.appendItems();
    });
    this.onSubmit();
  }
});
