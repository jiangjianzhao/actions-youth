
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
185
186
187
188
189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220
221
222
223
224
225
226
227
228
229
230
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
262
263
264
265
266
267
268
269
270
271
272
273
274
275
276
277
278
279
280
281
282
283
284
285
286
287
288
289
290
291
292
293
294
295
296
297
298
299
300
301
302
303
304
305
306
307
308
309
310
311
312
313
314
315
316
317
318
319
320
321
322
323
324
325
326
327
328
329
330
331
332
333
334
335
336
337
338
339
340
341
342
343
344
345
346
347
348
349
350
351
352
353
354
355
356
357
358
359
360
361
362
363
364
365
366
367
368
369
370
371
372
373
374
375
376
377
378
379
380
381
382
383
384
385
386
387
388
389
390
391
392
393
394
395
396
397
398
399
400
401
402
403
404
405
406
407
408
409
410
411
412
413
414
415
416
417
418
419
420
421
422
423
424
425
426
427
428
429
430
431
432
433
434
435
436
437
438
439
440
441
442
443
444
445
446
447
448
449
450
451
452
453
454
455
456
457
458
459
460
461
462
463
464
465
466
467
468
469
470
471
472
473
474
475
476
477
478
479
480
481
482
483
484
485
486
487
488
489
490
491
492
493
494
495
496
497
498
499
500
501
502
503
504
505
506
507
508
509
510
511
512
513
514
515
516
517
518
519
520
521
522
523
524
525
526
527
528
529
530
531
532
533
534
535
536
537
538
539
540
541
542
543
544
545
546
547
548
549
550
551
552
553
554
555
556
557
558
559
560
561
562
563
564
565
566
567
568
569
570
571
572
573
574
575
576
577
578
579
580
581
582
583
584
585
586
587
588
589
590
591
592
593
594
595
596
597
598
599
600
601
602
603
604
605
606
607
608
609
610
611
612
613
614
615
616
617
618
619
620
621
622
623
624
625
626
627
628
629
630
631
632
633
634
635
636
637
638
639
640
641
642
643
644
645
646
647
648
649
650
651
652
653
654
655
656
657
658
659
660
661
662
663
664
665
666
667
668
669
670
671
672
673
674
675
676
677
678
679
680
681
682
683
684
685
686
687
688
689
690
691
692
693
694
695
696
697
698
699
700
701
702
703
704
705
706
707
708
709
710
711
712
713
714
715
716
717
718
719
720
721
722
723
724
725
726
727
728
729
730
731
732
733
734
735
736
737
738
739
740
741
742
743
744
745
746
747
748
749
750
751
752
753
754
755
756
757
758
759
760
761
762
763
764
765
766
767
768
769
770
771
772
773
774
775
776
777
778
779
780
781
782
783
784
785
786
787
788
789
790
791
792
793
794
795
796
797
798
799
800
801
802
803
804
805
806
807
808
809
810
811
812
813
814
815
816
817
818
819
820
821
822
823
824
825
826
827
828
829
830
831
832
833
834
835
/*
crazy joy
挂机领金币/宝箱专用
活动入口：京东APP我的-更多工具-疯狂的JOY
⚠️建议云端使用。手机端不建议使用(会一直跑下去，永不停止)
10 7 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_crazy_joy_coin.js

 */


const $ = new Env('crazyJoy挂机');
const JD_API_HOST = 'https://api.m.jd.com/';

const notify = $.isNode() ? require('./sendNotify') : '';
let cookiesArr = [], cookie = '', message = '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = jsonParse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}
!function (n) {
  "use strict";

  function t(n, t) {
    var r = (65535 & n) + (65535 & t);
    return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r
  }

  function r(n, t) {
    return n << t | n >>> 32 - t
  }

  function e(n, e, o, u, c, f) {
    return t(r(t(t(e, n), t(u, f)), c), o)
  }

  function o(n, t, r, o, u, c, f) {
    return e(t & r | ~t & o, n, t, u, c, f)
  }

  function u(n, t, r, o, u, c, f) {
    return e(t & o | r & ~o, n, t, u, c, f)
  }

  function c(n, t, r, o, u, c, f) {
    return e(t ^ r ^ o, n, t, u, c, f)
  }

  function f(n, t, r, o, u, c, f) {
    return e(r ^ (t | ~o), n, t, u, c, f)
  }

  function i(n, r) {
    n[r >> 5] |= 128 << r % 32,
      n[14 + (r + 64 >>> 9 << 4)] = r;
    var e, i, a, d, h, l = 1732584193, g = -271733879, v = -1732584194, m = 271733878;
    for (e = 0; e < n.length; e += 16)
      i = l,
        a = g,
        d = v,
        h = m,
        g = f(g = f(g = f(g = f(g = c(g = c(g = c(g = c(g = u(g = u(g = u(g = u(g = o(g = o(g = o(g = o(g, v = o(v, m = o(m, l = o(l, g, v, m, n[e], 7, -680876936), g, v, n[e + 1], 12, -389564586), l, g, n[e + 2], 17, 606105819), m, l, n[e + 3], 22, -1044525330), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 4], 7, -176418897), g, v, n[e + 5], 12, 1200080426), l, g, n[e + 6], 17, -1473231341), m, l, n[e + 7], 22, -45705983), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 8], 7, 1770035416), g, v, n[e + 9], 12, -1958414417), l, g, n[e + 10], 17, -42063), m, l, n[e + 11], 22, -1990404162), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 12], 7, 1804603682), g, v, n[e + 13], 12, -40341101), l, g, n[e + 14], 17, -1502002290), m, l, n[e + 15], 22, 1236535329), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 1], 5, -165796510), g, v, n[e + 6], 9, -1069501632), l, g, n[e + 11], 14, 643717713), m, l, n[e], 20, -373897302), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 5], 5, -701558691), g, v, n[e + 10], 9, 38016083), l, g, n[e + 15], 14, -660478335), m, l, n[e + 4], 20, -405537848), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 9], 5, 568446438), g, v, n[e + 14], 9, -1019803690), l, g, n[e + 3], 14, -187363961), m, l, n[e + 8], 20, 1163531501), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 13], 5, -1444681467), g, v, n[e + 2], 9, -51403784), l, g, n[e + 7], 14, 1735328473), m, l, n[e + 12], 20, -1926607734), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 5], 4, -378558), g, v, n[e + 8], 11, -2022574463), l, g, n[e + 11], 16, 1839030562), m, l, n[e + 14], 23, -35309556), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 1], 4, -1530992060), g, v, n[e + 4], 11, 1272893353), l, g, n[e + 7], 16, -155497632), m, l, n[e + 10], 23, -1094730640), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 13], 4, 681279174), g, v, n[e], 11, -358537222), l, g, n[e + 3], 16, -722521979), m, l, n[e + 6], 23, 76029189), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 9], 4, -640364487), g, v, n[e + 12], 11, -421815835), l, g, n[e + 15], 16, 530742520), m, l, n[e + 2], 23, -995338651), v = f(v, m = f(m, l = f(l, g, v, m, n[e], 6, -198630844), g, v, n[e + 7], 10, 1126891415), l, g, n[e + 14], 15, -1416354905), m, l, n[e + 5], 21, -57434055), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 12], 6, 1700485571), g, v, n[e + 3], 10, -1894986606), l, g, n[e + 10], 15, -1051523), m, l, n[e + 1], 21, -2054922799), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 8], 6, 1873313359), g, v, n[e + 15], 10, -30611744), l, g, n[e + 6], 15, -1560198380), m, l, n[e + 13], 21, 1309151649), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 4], 6, -145523070), g, v, n[e + 11], 10, -1120210379), l, g, n[e + 2], 15, 718787259), m, l, n[e + 9], 21, -343485551),
        l = t(l, i),
        g = t(g, a),
        v = t(v, d),
        m = t(m, h);
    return [l, g, v, m]
  }

  function a(n) {
    var t, r = "", e = 32 * n.length;
    for (t = 0; t < e; t += 8)
      r += String.fromCharCode(n[t >> 5] >>> t % 32 & 255);
    return r
  }

  function d(n) {
    var t, r = [];
    for (r[(n.length >> 2) - 1] = void 0,
           t = 0; t < r.length; t += 1)
      r[t] = 0;
    var e = 8 * n.length;
    for (t = 0; t < e; t += 8)
      r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32;
    return r
  }

  function h(n) {
    return a(i(d(n), 8 * n.length))
  }

  function l(n, t) {
    var r, e, o = d(n), u = [], c = [];
    for (u[15] = c[15] = void 0,
         o.length > 16 && (o = i(o, 8 * n.length)),
           r = 0; r < 16; r += 1)
      u[r] = 909522486 ^ o[r],
        c[r] = 1549556828 ^ o[r];
    return e = i(u.concat(d(t)), 512 + 8 * t.length),
      a(i(c.concat(e), 640))
  }

  function g(n) {
    var t, r, e = "";
    for (r = 0; r < n.length; r += 1)
      t = n.charCodeAt(r),
        e += "0123456789abcdef".charAt(t >>> 4 & 15) + "0123456789abcdef".charAt(15 & t);
    return e
  }

  function v(n) {
    return unescape(encodeURIComponent(n))
  }

  function m(n) {
    return h(v(n))
  }

  function p(n) {
    return g(m(n))
  }

  function s(n, t) {
    return l(v(n), v(t))
  }

  function C(n, t) {
    return g(s(n, t))
  }

  function A(n, t, r) {
    return t ? r ? s(t, n) : C(t, n) : r ? m(n) : p(n)
  }

  $.md5 = A
}(this);
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  let count = 0

  if (cookiesArr.length && $.isNode()) {
    console.log(`\n挂机开始，自动8s收一次金币`);
    //兼容iOS
    setInterval(async () => {
      const promiseArr = cookiesArr.map(ck => getCoinForInterval(ck));
      await Promise.all(promiseArr);
    }, 8000);
  }

  while (true) {
    count++
    console.log(`============开始第${count}次挂机=============`)
    for (let i = 0; i < cookiesArr.length; i++) {
      if (cookiesArr[i]) {
        cookie = cookiesArr[i];
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
        $.index = i + 1;
        $.isLogin = true;
        $.nickName = '';
        await TotalBean();
        console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
        if (!$.isLogin) {
         $.log(`\n京东账号${$.index} ${$.nickName || $.UserName}\ncookie已过期,请重新登录获取\n`)
          continue
        }
        await jdCrazyJoy()
      }
    }
    $.log(`\n\n`)
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdCrazyJoy() {
  $.coin = 0
  $.bean = 0

  $.canBuy = true
  await getJoyList()
  await $.wait(1000)
  if ($.joyIds && $.joyIds.length > 0) {
    $.log('当前JOY分布情况')
    $.log(`\n${$.joyIds[0]} ${$.joyIds[1]} ${$.joyIds[2]} ${$.joyIds[3]}`)
    $.log(`${$.joyIds[4]} ${$.joyIds[5]} ${$.joyIds[6]} ${$.joyIds[7]}`)
    $.log(`${$.joyIds[8]} ${$.joyIds[9]} ${$.joyIds[10]} ${$.joyIds[11]}\n`)
  }

  await getJoyShop()
  await $.wait(1000)

  // 如果格子全部被占有且没有可以合并的JOY，只能回收低级的JOY (且最低等级的JOY小于30级)
  if(checkHasFullOccupied() && !checkCanMerge() && finMinJoyLevel() < 30) {
    const minJoyId = Math.min(...$.joyIds);
    const boxId = $.joyIds.indexOf(minJoyId);
    console.log(`格子全部被占有且没有可以合并的JOY，回收${boxId + 1}号位等级为${minJoyId}的JOY`)
    await sellJoy(minJoyId, boxId);
    await $.wait(1000)
    await getJoyList();
    await $.wait(1000)
  }

  await hourBenefit()
  await $.wait(1000)
  await getCoin()
  await $.wait(1000)

  for (let i = 0; i < $.joyIds.length; ++i) {
    if (!$.canBuy) {
      $.log(`金币不足，跳过购买`)
      break
    }
    if ($.joyIds[i] === 0) {
      await buyJoy($.buyJoyLevel)
      await $.wait(1000)
      await getJoyList()
      await $.wait(1000)
      await getCoin();
    }
  }

  let obj = {};
  $.joyIds.map((vo, idx) => {
    if (vo !== 0) {
      if (obj[vo]) {
        obj[vo].push(idx)
      } else {
        obj[vo] = [idx]
      }
    }
  })
  for (let idx in obj) {
    const vo = obj[idx]
    if (idx < 34 && vo.length >= 2) {
      $.log(`开始合并两只${idx}级joy\n`)
      await mergeJoy(vo[0], vo[1])
      await $.wait(3000)
      await getJoyList()
      await $.wait(1000)
      if ($.joyIds && $.joyIds.length > 0) {
        $.log('合并后的JOY分布情况')
        $.log(`\n${$.joyIds[0]} ${$.joyIds[1]} ${$.joyIds[2]} ${$.joyIds[3]}`)
        $.log(`${$.joyIds[4]} ${$.joyIds[5]} ${$.joyIds[6]} ${$.joyIds[7]}`)
        $.log(`${$.joyIds[8]} ${$.joyIds[9]} ${$.joyIds[10]} ${$.joyIds[11]}\n`)
      }
    }
    if (idx === '34' && vo.length >= 8) {
      if ($.coin >= 6000000000000000) {
        //当存在8个34级JOY，并且剩余金币可为后面继续合成两只新的34级JOY(按全部用30级JOY合成一只34级JOY计算需:1.66T * 2 * 2 * 2 * 2 = 26.56T = 2.6Q)时,则此条件下合并两个34级JOY
        $.log(`开始合并两只${idx}级joy\n`)
        await mergeJoy(vo[0], vo[1])
        await $.wait(3000)
        await getJoyList()
        await $.wait(1000)
        if ($.joyIds && $.joyIds.length > 0) {
          $.log('合并后的JOY分布情况')
          $.log(`\n${$.joyIds[0]} ${$.joyIds[1]} ${$.joyIds[2]} ${$.joyIds[3]}`)
          $.log(`${$.joyIds[4]} ${$.joyIds[5]} ${$.joyIds[6]} ${$.joyIds[7]}`)
          $.log(`${$.joyIds[8]} ${$.joyIds[9]} ${$.joyIds[10]} ${$.joyIds[11]}\n`)
        }
      }
    }
  }
  await getUserBean()
  await $.wait(5000)
  console.log(`当前信息：${$.bean} 京豆，${$.coin} 金币`)
}
//查询格子里面是否还有空格
function checkHasFullOccupied() {
  return !$.joyIds.includes(0);
}

// 查询是否有34级JOY
function checkHas34Level() {
  return $.joyIds.includes(34);
}

//查找格子里面有几个空格
function findZeroNum() {
  return $.joyIds.filter(i => i === 0).length
}
//查找当前 购买 joyLists 中最低等级的那一个
function finMinJoyLevel() {
  return Math.min(...$.joyIds.filter(s => s))
}
/**
 * 来源：https://elecv2.ml/#算法研究之合并类小游戏的最优购买问题
 * 获取下一个合适的购买等级。（算法二优化版）
 * @param     {array}     joyPrices    商店 joy 价格和等级列表
 * @param     {number}    start        开始比较的等级。范围1~30，默认：30
 * @param     {number}    direction    向上比较还是向下比较。0：向下比较，1：向上比较，默认：0
 * @return    {number}                 返回最终适合购买的等级
 */
function getBuyid2b(joyPrices, start = 30, direction = 0) {
  if (start < 1 || start > 30) {
    console.log('start 等级输入不合法')
    return 1
  }
  let maxL = 30        // 设置最高购买等级
  if (direction) {
    // 向上比较
    for (let ind = start - 1; ind < maxL - 1; ind++) {       // 商店 joy 等级和序列号相差1，需要减一下
      if (joyPrices[ind].coins * 2 < joyPrices[ind + 1].coins) return joyPrices[ind].joyId
    }
    return maxL
  } else {
    // 向下比较
    for (let ind = start - 1; ind > 0; ind--) {
      if (joyPrices[ind].coins <= joyPrices[ind - 1].coins * 2) return joyPrices[ind].joyId
    }
    return 1
  }
}

function buyJoyLogic() {
  new Promise(async resolve => {
    let zeroNum = findZeroNum();
    if (zeroNum === 0) {
      console.log('格子满了')
    } else if (zeroNum === 1) {
      await buyJoy(finMinJoyLevel());
    } else {
      let buyLevel = 1, joyPrices
      console.log('joyPrices', JSON.stringify($.joyPrices))
      if (zeroNum > 2) joyPrices = $.joyPrices;
      while (zeroNum--) {
        await $.wait(1000)
        if (zeroNum >= 2 && joyPrices && joyPrices.length) {
          // buyLevel = getBuyid2b(joyPrices, joyPrices.length)     // 具体参数可根据个人情况进行调整
          buyLevel = getBuyid2b(joyPrices)     // 具体参数可根据个人情况进行调整
        }
        if ($.joyPrices) {
          //添加判断。避免在获取$.joyPrices失败时，直接买等级1
          await buyJoy(buyLevel)
        }
      }
    }
    resolve()
  })
}

function checkCanMerge() {
  let obj = {};
  let canMerge = false;
  $.joyIds.forEach((vo, idx) => {
    if (vo !== 0 && vo !== 34) {
      if (obj[vo]) {
        obj[vo].push(idx)
        canMerge = true;
      } else {
        obj[vo] = [idx]
      }
    }
  });
  return canMerge;
}

function getJoyList() {
  $.joyIds = []
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_user_gameState'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            //console.log(data)
            if (data.success && data.data.joyIds) {
              $.joyIds = data.data.joyIds
            } else
              console.log(`joy信息获取信息失败`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function getJoyShop() {
  const body = {"paramData": {"entry": "SHOP"}}
  return new Promise((resolve) => {
    $.get(taskUrl('crazyJoy_joy_allowBoughtList', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.success && data.data && data.data.shop) {
            const shop = data.data.shop.filter(vo => vo.status === 1) || [];
            $.joyPrices = shop;
            $.buyJoyLevel = shop.length ? shop[shop.length - 1]['joyId'] : 1;//可购买的最大等级
            if ($.isNode() && process.env.BUY_JOY_LEVEL) {
              $.log(`当前可购买的最高JOY等级为${$.buyJoyLevel}级\n`)
              $.buyJoyLevel = (process.env.BUY_JOY_LEVEL * 1) > $.buyJoyLevel ? $.buyJoyLevel : process.env.BUY_JOY_LEVEL * 1;
              $.cost = shop[$.buyJoyLevel - 1]['coins']
            } else {
              $.cost = shop.length ? shop[shop.length - 1]['coins'] : Infinity
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

function mergeJoy(x, y) {
  let body = {"operateType": "MERGE", "fromBoxIndex": x, "targetBoxIndex": y}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_joy_moveOrMerge', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data.newJoyId) {
              if (data.data.newJoyId > 34) {
                let level = function (newJoyId) {
                  switch (newJoyId) {
                    case 1003:
                      return '多多JOY'
                    case 1004:
                      return '快乐JOY'
                    case 1005:
                      return '好物JOY'
                    case 1006:
                      return '省钱JOY'
                    case 1007:
                      return '东东JOY'
                    default:
                      return '未知JOY'
                  }
                }
                console.log(`合并成功，获得${level(data.data.newJoyId)}级Joy`)
                if (data.data.newJoyId === 1007 && $.isNode()) await notify.sendNotify($.name, `京东账号${$.index} ${$.nickName}\n合并成功，获得${level(data.data.newJoyId)}级Joy`)
              } else {
                console.log(`合并成功，获得${data.data.newJoyId}级Joy`)
              }
            } else
              console.log(`合并失败，错误`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function buyJoy(joyId) {
  const body = {"action": "BUY", "joyId": joyId, "boxId": ""}
  return new Promise((resolve) => {
    $.get(taskUrl('crazyJoy_joy_trade', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.success) {
            if (data.data.eventInfo) {
              await openBox(data.data.eventInfo.eventType, data.data.eventInfo.eventRecordId)
              await $.wait(1000)
              $.log('金币不足')
              $.canBuy = false
              return
            }
            $.log(`购买${joyId}级joy成功，剩余金币【${data.data.totalCoins}】`)
            $.coin = data.data.totalCoins
          } else {
            console.log(data.message)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

// 出售（回收）joy
function sellJoy(joyId, boxId) {
  const body = {"action": "SELL", "joyId": joyId, "boxId": boxId}
  return new Promise((resolve) => {
    $.get(taskUrl('crazyJoy_joy_trade', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.success) {
            if (data.data.eventInfo) {
              await openBox(data.data.eventInfo.eventType, data.data.eventInfo.eventRecordId)
              await $.wait(1000)
              $.canBuy = false
              return
            }
            $.log(`回收${joyId}级joy成功，剩余金币【${data.data.totalCoins}】`)
            $.coin = data.data.totalCoins
          } else {
            console.log(data.message)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

function hourBenefit() {
  let body = {"eventType": "HOUR_BENEFIT"}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_event_obtainAward', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success)
              console.log(`金币补给领取成功，获得${data.data.coins}金币`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function getUserBean() {
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_user_getJdBeanInfo'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data && data.data.totalBeans)
              $.bean = data.data.totalBeans
            else
              console.log(`京豆信息获取信息失败`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function getCoin() {
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_joy_produce'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data && data.data.tryMoneyJoyBeans) {
              console.log(`分红狗生效中，预计获得 ${data.data.tryMoneyJoyBeans} 京豆奖励`)
            }
            if (data.data && data.data.totalCoinAmount) {
              $.coin = data.data.totalCoinAmount;
              $.log(`当前金币:${$.coin}\n`)
            } else {
              $.coin = `获取当前金币数量失败`
            }
            if (data.data && data.data.luckyBoxRecordId) {
              await openBox('LUCKY_BOX_DROP',data.data.luckyBoxRecordId)
              await $.wait(1000)
            }
            if (data.data) {
              $.log(`此次在线收益：获得 ${data.data['coins']} 金币`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

// 需传入cookie，不能使用全局的cookie
function getCoinForInterval(taskCookie) {
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_joy_produce', '', taskCookie), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            // const userName = decodeURIComponent(taskCookie.match(/pt_pin=(.+?);/) && taskCookie.match(/pt_pin=(.+?);/)[1])
            // data = JSON.parse(data);
            // if (data.data && data.data.tryMoneyJoyBeans) {
            //   console.log(`【京东账号 ${userName}】分红狗生效中，预计获得 ${data.data.tryMoneyJoyBeans} 京豆奖励`)
            // }
            // if (data.data) {
            //   $.log(`【京东账号 ${userName}】此次在线收益：获得 ${data.data['coins']} 金币`)
            // }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function openBox(eventType = 'LUCKY_BOX_DROP', boxId) {
  let body = { eventType, "eventRecordId": boxId}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_event_getVideoAdvert', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['success']) {
              $.log(`点击幸运盒子成功，剩余观看视频次数：${data.data.advertViewTimes}, ${data.data.advertViewTimes > 0 ? '等待32秒' : '跳出'}`)
              if (data.data.advertViewTimes > 0) {
                await $.wait(32000)
                await rewardBox(eventType, boxId);
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function rewardBox(eventType, boxId) {
  let body = { eventType, "eventRecordId": boxId}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_event_obtainAward', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          $.log(`${JSON.stringify(err)}`)
          $.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['success']) {
              $.log(`幸运盒子奖励领取成功，获得：${data.data.beans}京豆，${data.data.coins}金币`)
            } else {
              $.log(`幸运盒子奖励领取失败，错误信息：${data.message || JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function getGrowState() {
  let body = {"paramData":{"eventType":"GROWTH_REWARD"}}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_event_getGrowthAndSceneState', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          $.log(`${JSON.stringify(err)}`)
          $.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['success'] && data.data) {
              for(let vo of data.data){
                if(vo['status']){
                  console.log(`${vo['joyId']}升级奖励可以领取`)
                }
              }
            } else {
              $.log(`幸运盒子奖励领取失败，错误信息：${data.message || JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function taskUrl(functionId, body = '', taskCookie = cookie) {
  let t = Date.now().toString().substr(0, 10)
  let e = body || ""
  e = $.md5("aDvScBv$gGQvrXfva8dG!ZC@DA70Y%lX" + e + t)
  e = e + Number(t).toString(16)
  return {
    url: `${JD_API_HOST}?uts=${e}&appid=crazy_joy&functionId=${functionId}&body=${escape(body)}&t=${t}`,
    headers: {
      'Cookie': taskCookie,
      'Host': 'api.m.jd.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
      'Accept-Language': 'zh-cn',
      'Referer': 'https://crazy-joy.jd.com/',
      'origin': 'https://crazy-joy.jd.com',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            $.nickName = data['base'].nickname;
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie')
      return [];
    }
  }
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
