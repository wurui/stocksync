define(['oxjs'], function (OX) {
    var targetDS = '/stock-analysis@';
    //targetDS='/stock-analysis@'
    OX.config({devHost:'//local.openxsl.com'})

    var syncRemote = function (data) {
            //2587dc2a8630406d73ce62957
            var callbackcounter = data.length,
                afterSave = function () {
                    callbackcounter--;
                    if (!callbackcounter) {
                        console.log('done')
                    }
                };
            for (var i = 0; i < data.length; i++) {
                var n = data[i];
                OX.callapi('update' + targetDS, {
                    query: {
                        symbol: n.symbol
                    },
                    update: {
                        $set: {
                            med: n.med,
                            close: n.close,
                            avg: n.avg,
                            lastDate: n.lastDate
                        }
                    }

                }, afterSave);
            }

        },
        filltr = function (tr, data) {
            var percent = (data.medLow > 0 ? '+' : '') + (data.medLow * 100).toFixed(1) + '%'
            data.percent = '<em class="percent ' + (data.medLow > 0 ? 'positive' : 'negative') + '">' + percent + '</em>'
            $(tr).find('[data-key]').each(function () {
                var key = this.getAttribute('data-key');
                this.innerHTML = data[key] || ''
            })
        },
        syncDate = function (trs) {
            var symbols = [], domCache = {};
            for (var i = 0, tr; tr = trs[i++];) {
                var symbol = tr.getAttribute('data-href');
                symbols.push(symbol);
                domCache[symbol] = tr;
            }
            if(symbols.length) {
                OX.getJSON('http://momofox.com:8000/analyze/querymaybelow?symbols=' + symbols.join(','), function (r) {

                    //console.log(r);

                    for (var i = 0, n; n = r[i++];) {
                        var tr = domCache[n.symbol];
                        filltr(tr, n)
                    }
                    syncRemote(r);


                });
            }


        },
        checkDate = function ($mod) {
            OX.getJSON('http://momofox.com:8000/historical/getlastdates?limit=1', function (r) {
                var target_date = r.data[0],
                    trs = [];
                //console.log(target_date)

                $mod.find('tr[data-date]').each(function (i, n) {
                    var date = n.getAttribute('data-date');
                    if (date != target_date) {
                        trs.push(n);
                    }
                });
                syncDate(trs)

            });
        };
    return {
        init: function ($mod) {


            targetDS+=$mod.attr('data-dsid');

            var lastFocusNode, cls = 'selected';
            var qs = $mod.attr('data-qs'),
                param = {},
                checkSelect = function () {
                    if (lastFocusNode)lastFocusNode.removeClass(cls);
                    var symbol = OX.queryString(qs);//console.log(symbol)
                    if (symbol) {
                        lastFocusNode = $mod.find('tr[data-href="' + symbol + '"]').addClass(cls);
                    }
                };
            $mod.on('tap', '[data-href]', function (e) {
                e.preventDefault();
                //console.log('clicked');
                /*
                 if (lastFocusNode)lastFocusNode.removeClass(cls);
                 lastFocusNode = $(this).addClass(cls);
                 */

                param[qs] = this.getAttribute('data-href');

                OX.changeState(param)

                //location.href = this.getAttribute('data-href')
            });
            OX.onstatechanged(checkSelect);

            checkSelect();

            checkDate($mod)
        }

    }
})
