var source = $('#products-template').html();
var template = Handlebars.compile(source);

$('document').ready(function(){
    loadProducts();
});

function loadProducts() {
    $.getJSON('products.json', function(data) {
        $('#products_section').append(template({data: data}));
    });
}

/* добавление ссылок "могут понадобиться" */
Handlebars.registerHelper('splitAssoc', function(assoc) {
    var i;
    var assocN = assoc.split(";").filter(function (e) {return e != '';});
    var assocNew = [];
    for (i = 0; i < assocN.length; i++) {
        if (i != assocN.length-1) {
            assocNew.push(assocN[i] + ",");
        } else {
            assocNew.push(assocN[i] + ".");
            break;
        }
    }
    return assocNew;
  });

/* Убираем нули из кода товара */
Handlebars.registerHelper('codeHelper', function(code) {
    return Number(code).toString();
});

/* создаем функцию проверки на целое число (для поддержки в IE) */
function isInteger(num) {
    return (num ^ 0) === num;
  }

/* Округляем цену за м.кв */
Handlebars.registerHelper('altHelper', function(alt) {
    if (isInteger(alt)) {
        return alt;
    }
    return Number(alt).toFixed(2);
});

/* Добавление строкового модификатора '_220x220_1' к изображениям */
Handlebars.registerHelper('imgHelp', function(img) {
    return img.replace(/(\.\w+)$/i,'_220x220_1$1');
    //return img.replace(/(?<!_220x220_1)(\.\w+)$/i,'_220x220_1$1');
});


/* В каком виде продается */
Handlebars.registerHelper('unitHelper', function(unit) {
    if (unit == "штука" || unit == "упаковка") {
        return unit+"ми";
    } else {
        return "метрами погонными";
    }
});

/* расчет необходимых бонусов */
Handlebars.registerHelper('pointsHelper', function(price) {
    return (price*0.25).toFixed(2);
});

/* отображение наличия товара */
Handlebars.registerHelper('activeHelper', function(active) {
    if (active) {
        return "Наличие";
    } else {
        return "Нет в наличии";
    }
});

/* Отображение unitFull (второе значение) на переключателе стоимости товара */
Handlebars.registerHelper('fullHelper', function(full) {
    if (full == 'упаковка') {
        return 'упаковку';
    } else if (full == 'штука') {
        return 'штуку';
    }
    return full;
});


/* Добавление функции стрелок (увеличение/уменьшение количества товара) */
$(document).on('click', '.stepper-arrow', function() {
    var btn = $(this)[0];
    var input = $(this).siblings('.product__count');
    if (btn.className == 'stepper-arrow up') {
        input.val(Number(input.val()) + 1);
    } else if (btn.className == 'stepper-arrow down') {
        if (input.val() > 0) {
            input.val(Number(input.val()) - 1);
        }
    }
});

/* добавление функции переключения м.кв/упаковку и цены соответственно */
$(document).on('click', '.product_units', function() {
    $(this).find('.unit--select').toggleClass("unit--active");
    var priceCard = $(this).siblings('.product_price_club_card');
    var price = $(this).siblings('.product_price_default');
    priceCard.find(".goldPrice").toggleClass("none");
    price.find(".retailPrice").toggleClass("none");
});

