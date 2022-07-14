class Good {
    constructor (options) {
        this.id = options.id;
        this.name = options.name;
        this.description = options.description;
        this.sizes = options.sizes;
        this.price = options.price;
        this.available = options.available;
    }
    setAvailable (value) {
        this.available = value;
    }
}

class GoodsList {
    #goods;
    constructor (options) {
        this.#goods = [];
        this.filter = options.filter;
        this.sortPrice = options.sortPrice;
        this.sortDir = options.sortDir;
    }
    get list () {
        if (this.sortPrice == true && this.sortDir == true) {
            return this.#goods
                .filter(good => good.available && RegExp(this.filter).test(good.name))
                .sort(function (a, b) {
                    if (a.price > b.price) {
                        return 1;
                    }
                    if (a.price < b.price) {
                        return -1;
                    }
                    return 0;
                })
        } else {
            return this.#goods.filter(good => good.available && RegExp(this.filter).test(good.name))
        }
    }
    add (good) {
        this.#goods.push(good)
    }
    remove (good) {
        delete this.#goods[this.#goods.indexOf(good)]
    }
}

class BasketGood extends Good {
    constructor (options, amount) {
        super(options);
        this.amount = amount;
    }
}

class Basket {
    // #goods;
    constructor (options) {
        this.goods = []
    }

    privateSum () {
        var totalAmount = 0;
        var totalSumm = 0
        this.goods.forEach(function(elem) {
            totalAmount += elem.amount;
            totalSumm += elem.price * elem.amount;
        });
        var result = {
            total_amount: totalAmount,
            total_summ: totalSumm
        }
        return result
    }

    get totalAmount () {
        return this.privateSum().total_amount
    }
    get totalSumm () {
        return this.privateSum().total_summ
    }

    add (good, amount) {
        let counter = 0
        this.goods.forEach(function(elem) {
            if (elem.id == good.id) {
                elem.amount += amount
                counter += 1
            }
        })
        if (counter == 0) {
            this.goods.push(new BasketGood(good, amount))
        }
    }

    remove (id, amount) {
        this.goods.forEach(function(elem) {
            if (elem.id == id) {
                elem.amount = elem.amount - amount
            }
        });
        this.goods.forEach(function(elem) {
            if (elem.amount <= 0) {
                this.goods.splice(this.goods.indexOf(elem), 1)
                // delete this.goods[this.goods.indexOf(aaa)]
            }
        })
    }

    clear () {
        this.goods.length = 0
    }

    removeUnavailable () {
        this.goods.forEach(function(elem) {
            if (elem.available == false) {
                delete this.goods[this.goods.indexOf(elem)]
            }
        })
    }
}



const cap = new Good ({
    id: 1,
    name: 'кепка',
    description: 'кепка NHL',
    sizes: 'L',
    price: 50,
    available: true,
})

const tShirt = new Good ({
    id: 2,
    name: 'футболка',
    description: 'футболка синяя',
    sizes: '46, 50',
    price: 120,
    available: true,
})

const socks = new Good ({
    id: 3,
    name: 'носки',
    description: 'короткие',
    sizes: '29',
    price: 10,
    available: true,
})

const catalog = new GoodsList ({
    filter: /к/i,
    sortPrice: true,
    sortDir: true,
})

const basket = new Basket ({})

// console.log(cap);
// console.log(tShirt);
// cap.available = false;
// console.log(cap);

catalog.add(cap);
catalog.add(tShirt);
catalog.add(socks);
console.log(catalog.list);
// catalog.remove(cap);
// console.log(catalog);


basket.add(cap, 5);
basket.add(tShirt, 2);
basket.add(tShirt, 1);
console.log(basket);
console.log(basket.totalAmount);
console.log(basket.totalSumm);
// basket.remove(2, 3);
basket.clear();
console.log(basket);