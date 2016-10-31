$(function () {
    //划过标签显示猫耳朵
    $("#categorytags a").mouseenter(function () {
         var catLeft = $(this).position().left;
         var catTop = $(this).position().top;
         var catWidth = $(this).css("width");
         var destLeft = parseInt(catLeft) + parseInt(catWidth)/5;
         $("#catear").css("left",destLeft);
         $("#catear").css("top",catTop-16);
         $("#catear").fadeIn(500);
    });
    $("#categorytags a").mouseleave(function () {
        $("#catear").hide();
    });

    //划过分类显示详细
    $("#itemlistlt div").mouseenter(function () {
        var sCid = $(this).attr("cid");
        $("#itemlistrt[cid=" + sCid +"]").show();
    });
    $("#itemlistlt div").mouseleave(function () {
        var sCid = $(this).attr("cid");
        $("#itemlistrt[cid=" + sCid +"]").hide();
    });
    $("#itemlistrt").mouseenter(function () {
        $(this).show();
    });
    $("#itemlistrt").mouseleave(function () {
        $(this).hide();
    });

    //sort.html 按照输入价格排序
    $("input.sortprice").keyup(function () {
        var num = $(this).val();
        if (num.length == 0) {
            $(".productunit").show();
            return;
        };
        num = parseInt(num);
        if(isNaN(num) || num<=0) {
            num = 1;
        }
        $(this).val(num);
        var priceMin = $(".minprice").val();
        var priceMax = $(".maxprice").val();
        $(".productunit").hide();
        $(".productunit").each(function () {
            var thisPrice = $(this).children("p.unitprice").text();
            thisPrice = thisPrice.replace(/[^0-9]/ig,"");
            thisPrice = parseInt(thisPrice);
            if (thisPrice<=priceMax && thisPrice>=priceMin) {
                $(this).show();
            };
        });
    });

    //productpage页面，hover小图显示大图
    $(".smallimg").each(function () {
        $(this).mouseenter(function () {
            var imgsrc = $(this).attr("src");
            $("#bigimg").attr("src",imgsrc);
        });
    });

    //修改价格效果
    var stock = 66;
    $("#selnum-input").keyup(function () {
        var num = $("#selnum-input").val();
        num = parseInt(num);
        if (num<=0 || isNaN(num)) {
            num = 1;
        }
        if (num > stock) {
            num = stock;
        }
        $("#selnum-input").val(num);
    });

    $(".glyphicon-arrow-up").click(function () {
        var num = $("#selnum-input").val();
        num = parseInt(num);
        num++;
        if (num>stock) {
            num = stock;
        }
        $("#selnum-input").val(num);
    })

    $(".glyphicon-arrow-down").click(function () {
        var num = $("#selnum-input").val();
        num = parseInt(num);
        num--;
        if (num<=0) {
            num = 1;
        }
        $("#selnum-input").val(num);
    })

    //点击按钮显示评价或商品详情
    $(".procomments").hide();
    $(".proxqbtn").click(function () {
        $(".proxqbtn").addClass("selected");
        $(".propjbtn").removeClass("selected");
        $(".procomments").hide();
        $(".detailimgbox").show();
    });

    $(".propjbtn").click(function () {
        $(".proxqbtn").removeClass("selected");
        $(".propjbtn").addClass("selected");
        $(".detailimgbox").hide();
        $(".procomments").show();
    })

    //格式化价格格式，千进制
    function formatMoney(num){
        num = num.toString().replace(/\$|\,/g,'');
        if(isNaN(num))
            num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num*100+0.50000000001);
        cents = num%100;
        num = Math.floor(num/100).toString();
        if(cents<10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor(num.length/3-1); i++)
            num = num.substring(0,num.length-(4*i+3))+','+
                num.substring(num.length-(4*i+3));
        return (((sign)?'':'-') + num + '.' + cents);
    }

    //单件商品选中后下单按钮变颜色
    function syncOrderbtn() {
        var selectAny = false;
        $(".selectbox").each(function () {
            if ($(this).attr("selectit")==="true") {
                selectAny = true;
            }
        });
        if (selectAny){
            $(".orderbtn").css("background-color","#c40000");
            $(".orderbtn").removeAttr("disabled");
        } else {
            $(".orderbtn").css("background-color","#aaaaaa");
            $(".orderbtn").attr("disabled","disabled");
        }
    }
    //单个商品全部选中后全选状态激活
    function syncSelect() {
        var selectAll = true;
        $(".selectbox").each(function () {
            if ($(this).attr("selectit")==="false"){
                selectAll = false;
            }
        });
        if (selectAll){
            $(".selectall").attr("src","img/site/cartSelected.png");
        } else {
            $(".selectall").attr("src","img/site/cartNotSelected.png");
        }
    }
    //计算选中商品的总价和商品总件数
    function calCartSumPriceAndNumber() {
        var sumPrice = 0;
        var totalNumber = 0;
        $(".selectbox[selectit='true']").each(function () {
            var proid = $(this).attr("proid");
            var price = $(".cartsmallprice[proid="+proid+"]").text();
            price = price.replace(/,/g,"");
            price = price.replace(/￥/g,"");
            price = new Number(price);
            sumPrice +=price;
            var num = $(".cartbodynuminput[proid="+proid+"]").val();
            num = new Number(num);
            totalNumber += num;
        });
        $(".cartsumprice").html("￥ "+formatMoney(sumPrice));
        $(".cartsumnum").html(totalNumber);
    }

    //根据商品数量和价格计算小计价格，接着计算总价
    function syncPrice(itemid,num,price) {
        $(".cartbodynuminput[itemid="+itemid+"]").val(num);
        var smallSumPrice = formatMoney(num*price);
        $(".cartsmallprice[itemid="+itemid+"]").html("￥ "+smallSumPrice);
        calCartSumPriceAndNumber();
    }

    //点击单件商品事件，根据状态改变商品勾选状态、下单按钮状态、总价和总件数
    $(".selectbox").click(function () {
       var selectit = $(this).attr("selectit");
       if (selectit === "true"){
           $(this).attr("selectit","false");
           $(this).attr("src","img/site/cartNotSelected.png");
           $(this).parents(".cartitemdetail").css("background-color","#fff");

       } else {
           $(this).attr("selectit","true");
           $(this).attr("src","img/site/cartSelected.png");
           $(this).parents(".cartitemdetail").css("background-color","#fff8e1");
       }
       syncSelect();
       syncOrderbtn();
       calCartSumPriceAndNumber();
    });

    //商品全选
    $(".selectall").click(function () {
        var selectit = $(this).attr("selectit");
        if (selectit === "true") {
            $(".selectall").attr("selectit","false");
            $(".selectall").attr("src","img/site/cartNotSelected.png");
            $(".selectbox").each(function () {
               $(".selectbox").attr("selectit","false");
               $(".selectbox").attr("src","img/site/cartNotSelected.png");
               $(".selectbox").parents(".cartitemdetail").css("background-color","#fff");
            });
        } else {
            $("img.selectall").attr("src","img/site/cartSelected.png");
            $("img.selectall").attr("selectit","true")
            $(".selectbox").each(function(){
                $(this).attr("src","img/site/cartSelected.png");
                $(this).attr("selectit","true");
                $(this).parents(".cartitemdetail").css("background-color","#FFF8E1");
            });
        }
            syncOrderbtn();
            calCartSumPriceAndNumber();
    });

    //增加或减少商品数量
    $(".cartbodynumplus").click(function () {
        var itemId = $(this).attr("itemid");
        var price = $(".cartproprice[itemid="+itemId+"]").text();
        var stock = $(".cartstock[itemid="+itemId+"]").text();
        var num = $(".cartbodynuminput[itemid="+itemId+"]").val();
        num++;
        if (num>stock){
            num=stock;
        }
        syncPrice(itemId,num,price);
    });

    $(".cartbodynumminus").click(function () {
        var itemId = $(this).attr("itemid");
        var price = $(".cartproprice[itemid="+itemId+"]").text();
        var stock = $(".cartstock[itemid="+itemId+"]").text();
        var num = $(".cartbodynuminput[itemid="+itemId+"]").val();
        num--;
        if (num<=0){
            num=1;
        }
        syncPrice(itemId,num,price);
    });

    //直接修改数量
    $(".cartbodynuminput").keyup(function () {
        var itemid = $(this).attr("itemid");
        var price = $(".cartproprice[itemid="+itemid+"]").text();
        var stock = $(".cartstock[itemid="+itemid+"]").text();
        var num = $(".cartbodynuminput[itemid="+itemid+"]").val();
        num = parseInt(num);
        if (isNaN(num)) {
            num = 1;
        }
        if (num<=0){
            num = 1;
        }
        if (num>stock){
            num = stock;
        }
        syncPrice(itemid,num,price);
    })

    //myOrderList页面，切换上方按钮显示不同状态的订单
    $(".listtitlebtn").click(function () {
        var statu = $(this).attr("statu");
        $(".listtitlebtn").removeClass("btnselected");
        $(this).addClass("btnselected");
        if (statu === "all") {
            $("div.listitemdetail").show();
        } else {
            $("div.listitemdetail").hide();
            $("div.listitemdetail[statu="+statu+"]").show();
        }
    });






});