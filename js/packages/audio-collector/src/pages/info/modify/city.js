var provinces = [
  { name: '福州市', id: '350100000000' },
  { name: '宁德市', id: '350900000000' },
  { name: '南平市', id: '350700000000' },
  { name: '三明市', id: '350400000000' },
  { name: '馬祖地區', id: '710900000000' },
  { name: '其他地域', id: '990000000000' }
]

var citys = {
  '350100000000': [
    { province: '福州市', name: '市辖区', id: '350101000000' },
    { province: '福州市', name: '鼓楼区', id: '350102000000' },
    { province: '福州市', name: '台江区', id: '350103000000' },
    { province: '福州市', name: '仓山区', id: '350104000000' },
    { province: '福州市', name: '马尾区', id: '350105000000' },
    { province: '福州市', name: '晋安区', id: '350111000000' },
    { province: '福州市', name: '长乐区', id: '350112000000' },
    { province: '福州市', name: '闽侯县', id: '350121000000' },
    { province: '福州市', name: '连江县', id: '350122000000' },
    { province: '福州市', name: '罗源县', id: '350123000000' },
    { province: '福州市', name: '闽清县', id: '350124000000' },
    { province: '福州市', name: '永泰县', id: '350125000000' },
    { province: '福州市', name: '平潭县', id: '350128000000' },
    { province: '福州市', name: '福清市', id: '350181000000' }
  ],
  '350900000000': [
    { province: '宁德市', name: '市辖区', id: '350901000000' },
    { province: '宁德市', name: '蕉城区', id: '350902000000' },
    { province: '宁德市', name: '霞浦县', id: '350921000000' },
    { province: '宁德市', name: '古田县', id: '350922000000' },
    { province: '宁德市', name: '屏南县', id: '350923000000' },
    { province: '宁德市', name: '寿宁县', id: '350924000000' },
    { province: '宁德市', name: '周宁县', id: '350925000000' },
    { province: '宁德市', name: '柘荣县', id: '350926000000' },
    { province: '宁德市', name: '福安市', id: '350981000000' },
    { province: '宁德市', name: '福鼎市', id: '350982000000' }
  ],
  '350700000000': [
    { province: '南平市', name: '市辖区', id: '350701000000' },
    { province: '南平市', name: '延平区', id: '350702000000' },
    { province: '南平市', name: '建阳区', id: '350703000000' },
    { province: '南平市', name: '顺昌县', id: '350721000000' },
    { province: '南平市', name: '浦城县', id: '350722000000' },
    { province: '南平市', name: '光泽县', id: '350723000000' },
    { province: '南平市', name: '松溪县', id: '350724000000' },
    { province: '南平市', name: '政和县', id: '350725000000' },
    { province: '南平市', name: '邵武市', id: '350781000000' },
    { province: '南平市', name: '武夷山市', id: '350782000000' },
    { province: '南平市', name: '建瓯市', id: '350783000000' }
  ],
  '350400000000': [
    { province: '三明市', name: '市辖区', id: '350401000000' },
    { province: '三明市', name: '梅列区', id: '350402000000' },
    { province: '三明市', name: '三元区', id: '350403000000' },
    { province: '三明市', name: '明溪县', id: '350421000000' },
    { province: '三明市', name: '清流县', id: '350423000000' },
    { province: '三明市', name: '宁化县', id: '350424000000' },
    { province: '三明市', name: '大田县', id: '350425000000' },
    { province: '三明市', name: '尤溪县', id: '350426000000' },
    { province: '三明市', name: '沙县', id: '350427000000' },
    { province: '三明市', name: '将乐县', id: '350428000000' },
    { province: '三明市', name: '泰宁县', id: '350429000000' },
    { province: '三明市', name: '建宁县', id: '350430000000' },
    { province: '三明市', name: '永安市', id: '350481000000' }
  ],
  '710900000000': [
    { province: '馬祖地區', name: '南竿', id: '710901000000' },
    { province: '馬祖地區', name: '北竿', id: '710902000000' },
    { province: '馬祖地區', name: '莒光', id: '710903000000' },
    { province: '馬祖地區', name: '東引', id: '710904000000' }
  ],
  '990000000000': [{ province: '其他地域', name: '-', id: '990100000000' }]
}
var areas = {
  '350101000000': [{ city: '市辖区', name: '-', id: '350101000001' }],
  '350102000000': [
    { city: '鼓楼区', name: '鼓东街道', id: '350102001000' },
    { city: '鼓楼区', name: '鼓西街道', id: '350102002000' },
    { city: '鼓楼区', name: '温泉街道', id: '350102003000' },
    { city: '鼓楼区', name: '东街街道', id: '350102004000' },
    { city: '鼓楼区', name: '南街街道', id: '350102005000' },
    { city: '鼓楼区', name: '安泰街道', id: '350102006000' },
    { city: '鼓楼区', name: '华大街道', id: '350102007000' },
    { city: '鼓楼区', name: '水部街道', id: '350102008000' },
    { city: '鼓楼区', name: '五凤街道', id: '350102009000' },
    { city: '鼓楼区', name: '洪山镇', id: '350102100000' }
  ],
  '350103000000': [
    { city: '台江区', name: '瀛洲街道', id: '350103001000' },
    { city: '台江区', name: '后洲街道', id: '350103002000' },
    { city: '台江区', name: '义洲街道', id: '350103003000' },
    { city: '台江区', name: '新港街道', id: '350103004000' },
    { city: '台江区', name: '上海街道', id: '350103005000' },
    { city: '台江区', name: '苍霞街道', id: '350103007000' },
    { city: '台江区', name: '茶亭街道', id: '350103009000' },
    { city: '台江区', name: '洋中街道', id: '350103010000' },
    { city: '台江区', name: '鳌峰街道', id: '350103011000' },
    { city: '台江区', name: '宁化街道', id: '350103012000' }
  ],
  '350104000000': [
    { city: '仓山区', name: '仓前街道', id: '350104001000' },
    { city: '仓山区', name: '东升街道', id: '350104002000' },
    { city: '仓山区', name: '对湖街道', id: '350104003000' },
    { city: '仓山区', name: '临江街道', id: '350104004000' },
    { city: '仓山区', name: '三叉街街道', id: '350104005000' },
    { city: '仓山区', name: '上渡街道', id: '350104006000' },
    { city: '仓山区', name: '下渡街道', id: '350104007000' },
    { city: '仓山区', name: '金山街道', id: '350104008000' },
    { city: '仓山区', name: '仓山镇', id: '350104100000' },
    { city: '仓山区', name: '城门镇', id: '350104101000' },
    { city: '仓山区', name: '盖山镇', id: '350104102000' },
    { city: '仓山区', name: '建新镇', id: '350104103000' },
    { city: '仓山区', name: '螺洲镇', id: '350104104000' },
    { city: '仓山区', name: '红星农场', id: '350104400000' }
  ],
  '350105000000': [
    { city: '马尾区', name: '罗星街道', id: '350105001000' },
    { city: '马尾区', name: '马尾镇', id: '350105100000' },
    { city: '马尾区', name: '亭江镇', id: '350105101000' },
    { city: '马尾区', name: '琅岐镇', id: '350105102000' }
  ],
  '350111000000': [
    { city: '晋安区', name: '茶园街道', id: '350111001000' },
    { city: '晋安区', name: '王庄街道', id: '350111002000' },
    { city: '晋安区', name: '象园街道', id: '350111003000' },
    { city: '晋安区', name: '鼓山镇', id: '350111100000' },
    { city: '晋安区', name: '新店镇', id: '350111101000' },
    { city: '晋安区', name: '岳峰镇', id: '350111102000' },
    { city: '晋安区', name: '宦溪镇', id: '350111103000' },
    { city: '晋安区', name: '寿山乡', id: '350111201000' },
    { city: '晋安区', name: '日溪乡', id: '350111202000' }
  ],
  '350112000000': [
    { city: '长乐区', name: '吴航街道', id: '350112001000' },
    { city: '长乐区', name: '航城街道', id: '350112002000' },
    { city: '长乐区', name: '营前街道', id: '350112003000' },
    { city: '长乐区', name: '漳港街道', id: '350112004000' },
    { city: '长乐区', name: '首占镇', id: '350112102000' },
    { city: '长乐区', name: '玉田镇', id: '350112103000' },
    { city: '长乐区', name: '松下镇', id: '350112104000' },
    { city: '长乐区', name: '江田镇', id: '350112105000' },
    { city: '长乐区', name: '古槐镇', id: '350112106000' },
    { city: '长乐区', name: '文武砂镇', id: '350112107000' },
    { city: '长乐区', name: '鹤上镇', id: '350112108000' },
    { city: '长乐区', name: '湖南镇', id: '350112110000' },
    { city: '长乐区', name: '金峰镇', id: '350112111000' },
    { city: '长乐区', name: '文岭镇', id: '350112112000' },
    { city: '长乐区', name: '梅花镇', id: '350112113000' },
    { city: '长乐区', name: '潭头镇', id: '350112114000' },
    { city: '长乐区', name: '罗联乡', id: '350112200000' },
    { city: '长乐区', name: '猴屿乡', id: '350112201000' }
  ],
  '350121000000': [
    { city: '闽侯县', name: '甘蔗街道', id: '350121001000' },
    { city: '闽侯县', name: '白沙镇', id: '350121101000' },
    { city: '闽侯县', name: '南屿镇', id: '350121102000' },
    { city: '闽侯县', name: '尚干镇', id: '350121103000' },
    { city: '闽侯县', name: '祥谦镇', id: '350121104000' },
    { city: '闽侯县', name: '青口镇', id: '350121105000' },
    { city: '闽侯县', name: '南通镇', id: '350121106000' },
    { city: '闽侯县', name: '上街镇', id: '350121107000' },
    { city: '闽侯县', name: '荆溪镇', id: '350121108000' },
    { city: '闽侯县', name: '竹岐乡', id: '350121200000' },
    { city: '闽侯县', name: '鸿尾乡', id: '350121201000' },
    { city: '闽侯县', name: '洋里乡', id: '350121202000' },
    { city: '闽侯县', name: '大湖乡', id: '350121203000' },
    { city: '闽侯县', name: '廷坪乡', id: '350121204000' },
    { city: '闽侯县', name: '小箬乡', id: '350121206000' },
    { city: '闽侯县', name: '江洋农场', id: '350121400000' }
  ],
  '350122000000': [
    { city: '连江县', name: '凤城镇', id: '350122100000' },
    { city: '连江县', name: '敖江镇', id: '350122101000' },
    { city: '连江县', name: '东岱镇', id: '350122102000' },
    { city: '连江县', name: '琯头镇', id: '350122103000' },
    { city: '连江县', name: '晓澳镇', id: '350122104000' },
    { city: '连江县', name: '东湖镇', id: '350122105000' },
    { city: '连江县', name: '丹阳镇', id: '350122106000' },
    { city: '连江县', name: '长龙镇', id: '350122107000' },
    { city: '连江县', name: '透堡镇', id: '350122108000' },
    { city: '连江县', name: '马鼻镇', id: '350122109000' },
    { city: '连江县', name: '官坂镇', id: '350122110000' },
    { city: '连江县', name: '筱埕镇', id: '350122111000' },
    { city: '连江县', name: '黄岐镇', id: '350122112000' },
    { city: '连江县', name: '苔菉镇', id: '350122113000' },
    { city: '连江县', name: '浦口镇', id: '350122114000' },
    { city: '连江县', name: '坑园镇', id: '350122115000' },
    { city: '连江县', name: '潘渡镇', id: '350122116000' },
    { city: '连江县', name: '江南镇', id: '350122117000' },
    { city: '连江县', name: '下宫镇', id: '350122118000' },
    { city: '连江县', name: '蓼沿乡', id: '350122202000' },
    { city: '连江县', name: '安凯乡', id: '350122203000' },
    { city: '连江县', name: '小沧畲族乡', id: '350122205000' },
    { city: '连江县', name: '马祖乡', id: '350122400000' }
  ],
  '350123000000': [
    { city: '罗源县', name: '凤山镇', id: '350123100000' },
    { city: '罗源县', name: '松山镇', id: '350123101000' },
    { city: '罗源县', name: '起步镇', id: '350123102000' },
    { city: '罗源县', name: '中房镇', id: '350123103000' },
    { city: '罗源县', name: '飞竹镇', id: '350123104000' },
    { city: '罗源县', name: '鉴江镇', id: '350123105000' },
    { city: '罗源县', name: '白塔乡', id: '350123200000' },
    { city: '罗源县', name: '洪洋乡', id: '350123201000' },
    { city: '罗源县', name: '西兰乡', id: '350123202000' },
    { city: '罗源县', name: '霍口畲族乡', id: '350123203000' },
    { city: '罗源县', name: '碧里乡', id: '350123204000' },
    { city: '罗源县', name: '罗源湾', id: '350123500000' }
  ],
  '350124000000': [
    { city: '闽清县', name: '梅城镇', id: '350124100000' },
    { city: '闽清县', name: '梅溪镇', id: '350124101000' },
    { city: '闽清县', name: '白樟镇', id: '350124102000' },
    { city: '闽清县', name: '金沙镇', id: '350124103000' },
    { city: '闽清县', name: '白中镇', id: '350124104000' },
    { city: '闽清县', name: '池园镇', id: '350124105000' },
    { city: '闽清县', name: '坂东镇', id: '350124106000' },
    { city: '闽清县', name: '塔庄镇', id: '350124107000' },
    { city: '闽清县', name: '省璜镇', id: '350124108000' },
    { city: '闽清县', name: '雄江镇', id: '350124109000' },
    { city: '闽清县', name: '东桥镇', id: '350124110000' },
    { city: '闽清县', name: '云龙乡', id: '350124200000' },
    { city: '闽清县', name: '上莲乡', id: '350124201000' },
    { city: '闽清县', name: '三溪乡', id: '350124204000' },
    { city: '闽清县', name: '桔林乡', id: '350124205000' },
    { city: '闽清县', name: '下祝乡', id: '350124206000' }
  ],
  '350125000000': [
    { city: '永泰县', name: '樟城镇', id: '350125100000' },
    { city: '永泰县', name: '嵩口镇', id: '350125101000' },
    { city: '永泰县', name: '梧桐镇', id: '350125102000' },
    { city: '永泰县', name: '葛岭镇', id: '350125103000' },
    { city: '永泰县', name: '城峰镇', id: '350125104000' },
    { city: '永泰县', name: '清凉镇', id: '350125105000' },
    { city: '永泰县', name: '长庆镇', id: '350125106000' },
    { city: '永泰县', name: '同安镇', id: '350125107000' },
    { city: '永泰县', name: '大洋镇', id: '350125108000' },
    { city: '永泰县', name: '塘前乡', id: '350125200000' },
    { city: '永泰县', name: '富泉乡', id: '350125201000' },
    { city: '永泰县', name: '岭路乡', id: '350125202000' },
    { city: '永泰县', name: '赤锡乡', id: '350125203000' },
    { city: '永泰县', name: '洑口乡', id: '350125204000' },
    { city: '永泰县', name: '盖洋乡', id: '350125205000' },
    { city: '永泰县', name: '东洋乡', id: '350125206000' },
    { city: '永泰县', name: '霞拔乡', id: '350125207000' },
    { city: '永泰县', name: '盘谷乡', id: '350125208000' },
    { city: '永泰县', name: '红星乡', id: '350125209000' },
    { city: '永泰县', name: '白云乡', id: '350125210000' },
    { city: '永泰县', name: '丹云乡', id: '350125211000' }
  ],
  '350128000000': [
    { city: '平潭县', name: '潭城镇', id: '350128100000' },
    { city: '平潭县', name: '苏澳镇', id: '350128101000' },
    { city: '平潭县', name: '流水镇', id: '350128102000' },
    { city: '平潭县', name: '澳前镇', id: '350128103000' },
    { city: '平潭县', name: '北厝镇', id: '350128104000' },
    { city: '平潭县', name: '平原镇', id: '350128105000' },
    { city: '平潭县', name: '敖东镇', id: '350128106000' },
    { city: '平潭县', name: '白青乡', id: '350128200000' },
    { city: '平潭县', name: '屿头乡', id: '350128201000' },
    { city: '平潭县', name: '大练乡', id: '350128202000' },
    { city: '平潭县', name: '芦洋乡', id: '350128203000' },
    { city: '平潭县', name: '中楼乡', id: '350128204000' },
    { city: '平潭县', name: '东庠乡', id: '350128205000' },
    { city: '平潭县', name: '岚城乡', id: '350128206000' },
    { city: '平潭县', name: '南海乡', id: '350128207000' }
  ],
  '350181000000': [
    { city: '福清市', name: '玉屏街道', id: '350181002000' },
    { city: '福清市', name: '龙山街道', id: '350181003000' },
    { city: '福清市', name: '龙江街道', id: '350181004000' },
    { city: '福清市', name: '宏路街道', id: '350181005000' },
    { city: '福清市', name: '石竹街道', id: '350181006000' },
    { city: '福清市', name: '音西街道', id: '350181007000' },
    { city: '福清市', name: '阳下街道', id: '350181008000' },
    { city: '福清市', name: '海口镇', id: '350181103000' },
    { city: '福清市', name: '城头镇', id: '350181104000' },
    { city: '福清市', name: '南岭镇', id: '350181105000' },
    { city: '福清市', name: '龙田镇', id: '350181106000' },
    { city: '福清市', name: '江镜镇', id: '350181107000' },
    { city: '福清市', name: '港头镇', id: '350181108000' },
    { city: '福清市', name: '高山镇', id: '350181109000' },
    { city: '福清市', name: '沙埔镇', id: '350181110000' },
    { city: '福清市', name: '三山镇', id: '350181111000' },
    { city: '福清市', name: '东瀚镇', id: '350181112000' },
    { city: '福清市', name: '渔溪镇', id: '350181113000' },
    { city: '福清市', name: '上迳镇', id: '350181114000' },
    { city: '福清市', name: '新厝镇', id: '350181115000' },
    { city: '福清市', name: '江阴镇', id: '350181116000' },
    { city: '福清市', name: '东张镇', id: '350181117000' },
    { city: '福清市', name: '镜洋镇', id: '350181118000' },
    { city: '福清市', name: '一都镇', id: '350181119000' },
    { city: '福清市', name: '江镜华侨', id: '350181400000' },
    { city: '福清市', name: '东阁华侨', id: '350181401000' }
  ],
  '350901000000': [{ city: '市辖区', name: '-', id: '350901000001' }],
  '350902000000': [
    { city: '蕉城区', name: '蕉南街道', id: '350902001000' },
    { city: '蕉城区', name: '蕉北街道', id: '350902002000' },
    { city: '蕉城区', name: '城南镇', id: '350902100000' },
    { city: '蕉城区', name: '漳湾镇', id: '350902101000' },
    { city: '蕉城区', name: '七都镇', id: '350902102000' },
    { city: '蕉城区', name: '八都镇', id: '350902103000' },
    { city: '蕉城区', name: '九都镇', id: '350902104000' },
    { city: '蕉城区', name: '霍童镇', id: '350902105000' },
    { city: '蕉城区', name: '赤溪镇', id: '350902106000' },
    { city: '蕉城区', name: '洋中镇', id: '350902107000' },
    { city: '蕉城区', name: '飞鸾镇', id: '350902108000' },
    { city: '蕉城区', name: '三都镇', id: '350902109000' },
    { city: '蕉城区', name: '虎贝镇', id: '350902110000' },
    { city: '蕉城区', name: '金涵畲族乡', id: '350902200000' },
    { city: '蕉城区', name: '洪口乡', id: '350902201000' },
    { city: '蕉城区', name: '石后乡', id: '350902202000' },
    { city: '蕉城区', name: '东侨开发区', id: '350902500000' }
  ],
  '350921000000': [
    { city: '霞浦县', name: '松城街道', id: '350921001000' },
    { city: '霞浦县', name: '松港街道', id: '350921002000' },
    { city: '霞浦县', name: '松山街道', id: '350921003000' },
    { city: '霞浦县', name: '长春镇', id: '350921101000' },
    { city: '霞浦县', name: '牙城镇', id: '350921102000' },
    { city: '霞浦县', name: '溪南镇', id: '350921103000' },
    { city: '霞浦县', name: '沙江镇', id: '350921104000' },
    { city: '霞浦县', name: '下浒镇', id: '350921105000' },
    { city: '霞浦县', name: '三沙镇', id: '350921106000' },
    { city: '霞浦县', name: '盐田畲族乡', id: '350921200000' },
    { city: '霞浦县', name: '水门畲族乡', id: '350921201000' },
    { city: '霞浦县', name: '崇儒畲族乡', id: '350921202000' },
    { city: '霞浦县', name: '柏洋乡', id: '350921203000' },
    { city: '霞浦县', name: '北壁乡', id: '350921204000' },
    { city: '霞浦县', name: '海岛乡', id: '350921205000' }
  ],
  '350922000000': [
    { city: '古田县', name: '城东街道', id: '350922001000' },
    { city: '古田县', name: '城西街道', id: '350922002000' },
    { city: '古田县', name: '平湖镇', id: '350922101000' },
    { city: '古田县', name: '大桥镇', id: '350922102000' },
    { city: '古田县', name: '黄田镇', id: '350922103000' },
    { city: '古田县', name: '鹤塘镇', id: '350922104000' },
    { city: '古田县', name: '杉洋镇', id: '350922105000' },
    { city: '古田县', name: '凤都镇', id: '350922106000' },
    { city: '古田县', name: '水口镇', id: '350922107000' },
    { city: '古田县', name: '大甲镇', id: '350922108000' },
    { city: '古田县', name: '吉巷乡', id: '350922201000' },
    { city: '古田县', name: '泮洋乡', id: '350922203000' },
    { city: '古田县', name: '凤埔乡', id: '350922204000' },
    { city: '古田县', name: '卓洋乡', id: '350922205000' }
  ],
  '350923000000': [
    { city: '屏南县', name: '古峰镇', id: '350923100000' },
    { city: '屏南县', name: '双溪镇', id: '350923101000' },
    { city: '屏南县', name: '代溪镇', id: '350923102000' },
    { city: '屏南县', name: '长桥镇', id: '350923103000' },
    { city: '屏南县', name: '棠口镇', id: '350923104000' },
    { city: '屏南县', name: '屏城乡', id: '350923200000' },
    { city: '屏南县', name: '甘棠乡', id: '350923202000' },
    { city: '屏南县', name: '熙岭乡', id: '350923203000' },
    { city: '屏南县', name: '路下乡', id: '350923204000' },
    { city: '屏南县', name: '寿山乡', id: '350923205000' },
    { city: '屏南县', name: '岭下乡', id: '350923206000' }
  ],
  '350924000000': [
    { city: '寿宁县', name: '鳌阳镇', id: '350924100000' },
    { city: '寿宁县', name: '斜滩镇', id: '350924101000' },
    { city: '寿宁县', name: '南阳镇', id: '350924102000' },
    { city: '寿宁县', name: '武曲镇', id: '350924103000' },
    { city: '寿宁县', name: '犀溪镇', id: '350924104000' },
    { city: '寿宁县', name: '平溪镇', id: '350924105000' },
    { city: '寿宁县', name: '凤阳镇', id: '350924106000' },
    { city: '寿宁县', name: '清源镇', id: '350924107000' },
    { city: '寿宁县', name: '大安乡', id: '350924200000' },
    { city: '寿宁县', name: '坑底乡', id: '350924201000' },
    { city: '寿宁县', name: '竹管垅乡', id: '350924203000' },
    { city: '寿宁县', name: '芹洋乡', id: '350924205000' },
    { city: '寿宁县', name: '托溪乡', id: '350924206000' },
    { city: '寿宁县', name: '下党乡', id: '350924209000' }
  ],
  '350925000000': [
    { city: '周宁县', name: '狮城镇', id: '350925100000' },
    { city: '周宁县', name: '咸村镇', id: '350925101000' },
    { city: '周宁县', name: '浦源镇', id: '350925102000' },
    { city: '周宁县', name: '七步镇', id: '350925103000' },
    { city: '周宁县', name: '李墩镇', id: '350925104000' },
    { city: '周宁县', name: '纯池镇', id: '350925105000' },
    { city: '周宁县', name: '泗桥乡', id: '350925200000' },
    { city: '周宁县', name: '礼门乡', id: '350925201000' },
    { city: '周宁县', name: '玛坑乡', id: '350925202000' }
  ],
  '350926000000': [
    { city: '柘荣县', name: '双城镇', id: '350926100000' },
    { city: '柘荣县', name: '富溪镇', id: '350926101000' },
    { city: '柘荣县', name: '城郊乡', id: '350926200000' },
    { city: '柘荣县', name: '乍洋乡', id: '350926201000' },
    { city: '柘荣县', name: '东源乡', id: '350926202000' },
    { city: '柘荣县', name: '黄柏乡', id: '350926203000' },
    { city: '柘荣县', name: '宅中乡', id: '350926204000' },
    { city: '柘荣县', name: '楮坪乡', id: '350926205000' },
    { city: '柘荣县', name: '英山乡', id: '350926206000' }
  ],
  '350981000000': [
    { city: '福安市', name: '城南街道', id: '350981001000' },
    { city: '福安市', name: '城北街道', id: '350981002000' },
    { city: '福安市', name: '阳头街道', id: '350981003000' },
    { city: '福安市', name: '罗江街道', id: '350981004000' },
    { city: '福安市', name: '赛岐镇', id: '350981100000' },
    { city: '福安市', name: '穆阳镇', id: '350981101000' },
    { city: '福安市', name: '上白石镇', id: '350981102000' },
    { city: '福安市', name: '潭头镇', id: '350981103000' },
    { city: '福安市', name: '社口镇', id: '350981104000' },
    { city: '福安市', name: '晓阳镇', id: '350981105000' },
    { city: '福安市', name: '溪潭镇', id: '350981106000' },
    { city: '福安市', name: '甘棠镇', id: '350981107000' },
    { city: '福安市', name: '下白石镇', id: '350981108000' },
    { city: '福安市', name: '溪尾镇', id: '350981109000' },
    { city: '福安市', name: '溪柄镇', id: '350981110000' },
    { city: '福安市', name: '湾坞镇', id: '350981111000' },
    { city: '福安市', name: '城阳镇', id: '350981112000' },
    { city: '福安市', name: '坂中畲族乡', id: '350981201000' },
    { city: '福安市', name: '范坑乡', id: '350981202000' },
    { city: '福安市', name: '穆云畲族乡', id: '350981203000' },
    { city: '福安市', name: '康厝畲族乡', id: '350981204000' },
    { city: '福安市', name: '松罗乡', id: '350981206000' },
    { city: '福安市', name: '福安畲族开发区', id: '350981501000' },
    { city: '福安市', name: '湾坞工业集中区', id: '350981502000' }
  ],
  '350982000000': [
    { city: '福鼎市', name: '桐山街道', id: '350982001000' },
    { city: '福鼎市', name: '桐城街道', id: '350982002000' },
    { city: '福鼎市', name: '山前街道', id: '350982003000' },
    { city: '福鼎市', name: '贯岭镇', id: '350982100000' },
    { city: '福鼎市', name: '前岐镇', id: '350982101000' },
    { city: '福鼎市', name: '沙埕镇', id: '350982102000' },
    { city: '福鼎市', name: '店下镇', id: '350982103000' },
    { city: '福鼎市', name: '太姥山镇', id: '350982104000' },
    { city: '福鼎市', name: '磻溪镇', id: '350982105000' },
    { city: '福鼎市', name: '白琳镇', id: '350982106000' },
    { city: '福鼎市', name: '点头镇', id: '350982107000' },
    { city: '福鼎市', name: '管阳镇', id: '350982108000' },
    { city: '福鼎市', name: '嵛山镇', id: '350982109000' },
    { city: '福鼎市', name: '硖门畲族乡', id: '350982200000' },
    { city: '福鼎市', name: '叠石乡', id: '350982201000' },
    { city: '福鼎市', name: '佳阳乡', id: '350982202000' },
    { city: '福鼎市', name: '龙安开发区', id: '350982500000' }
  ],
  '350701000000': [{ city: '市辖区', name: '-', id: '350701000001' }],
  '350702000000': [
    { city: '延平区', name: '梅山街道', id: '350702001000' },
    { city: '延平区', name: '黄墩街道', id: '350702002000' },
    { city: '延平区', name: '紫云街道', id: '350702003000' },
    { city: '延平区', name: '四鹤街道', id: '350702004000' },
    { city: '延平区', name: '水南街道', id: '350702005000' },
    { city: '延平区', name: '水东街道', id: '350702006000' },
    { city: '延平区', name: '来舟镇', id: '350702100000' },
    { city: '延平区', name: '樟湖镇', id: '350702101000' },
    { city: '延平区', name: '夏道镇', id: '350702102000' },
    { city: '延平区', name: '西芹镇', id: '350702103000' },
    { city: '延平区', name: '峡阳镇', id: '350702104000' },
    { city: '延平区', name: '南山镇', id: '350702105000' },
    { city: '延平区', name: '大横镇', id: '350702106000' },
    { city: '延平区', name: '王台镇', id: '350702107000' },
    { city: '延平区', name: '太平镇', id: '350702108000' },
    { city: '延平区', name: '塔前镇', id: '350702109000' },
    { city: '延平区', name: '茫荡镇', id: '350702110000' },
    { city: '延平区', name: '洋后镇', id: '350702111000' },
    { city: '延平区', name: '炉下镇', id: '350702112000' },
    { city: '延平区', name: '巨口乡', id: '350702200000' },
    { city: '延平区', name: '赤门乡', id: '350702202000' }
  ],
  '350703000000': [
    { city: '建阳区', name: '潭城街道', id: '350703001000' },
    { city: '建阳区', name: '童游街道', id: '350703002000' },
    { city: '建阳区', name: '将口镇', id: '350703102000' },
    { city: '建阳区', name: '徐市镇', id: '350703103000' },
    { city: '建阳区', name: '莒口镇', id: '350703104000' },
    { city: '建阳区', name: '麻沙镇', id: '350703105000' },
    { city: '建阳区', name: '黄坑镇', id: '350703106000' },
    { city: '建阳区', name: '水吉镇', id: '350703107000' },
    { city: '建阳区', name: '漳墩镇', id: '350703108000' },
    { city: '建阳区', name: '小湖镇', id: '350703109000' },
    { city: '建阳区', name: '崇雒乡', id: '350703200000' },
    { city: '建阳区', name: '书坊乡', id: '350703201000' },
    { city: '建阳区', name: '回龙乡', id: '350703202000' }
  ],
  '350721000000': [
    { city: '顺昌县', name: '双溪街道', id: '350721001000' },
    { city: '顺昌县', name: '建西镇', id: '350721100000' },
    { city: '顺昌县', name: '洋口镇', id: '350721101000' },
    { city: '顺昌县', name: '元坑镇', id: '350721102000' },
    { city: '顺昌县', name: '埔上镇', id: '350721103000' },
    { city: '顺昌县', name: '大历镇', id: '350721104000' },
    { city: '顺昌县', name: '大干镇', id: '350721105000' },
    { city: '顺昌县', name: '仁寿镇', id: '350721106000' },
    { city: '顺昌县', name: '郑坊镇', id: '350721107000' },
    { city: '顺昌县', name: '洋墩乡', id: '350721200000' },
    { city: '顺昌县', name: '岚下乡', id: '350721202000' },
    { city: '顺昌县', name: '高阳乡', id: '350721203000' }
  ],
  '350722000000': [
    { city: '浦城县', name: '南浦街道', id: '350722001000' },
    { city: '浦城县', name: '河滨街道', id: '350722002000' },
    { city: '浦城县', name: '富岭镇', id: '350722101000' },
    { city: '浦城县', name: '石陂镇', id: '350722102000' },
    { city: '浦城县', name: '临江镇', id: '350722103000' },
    { city: '浦城县', name: '仙阳镇', id: '350722104000' },
    { city: '浦城县', name: '水北街镇', id: '350722105000' },
    { city: '浦城县', name: '永兴镇', id: '350722106000' },
    { city: '浦城县', name: '忠信镇', id: '350722107000' },
    { city: '浦城县', name: '莲塘镇', id: '350722108000' },
    { city: '浦城县', name: '九牧镇', id: '350722109000' },
    { city: '浦城县', name: '万安乡', id: '350722200000' },
    { city: '浦城县', name: '古楼乡', id: '350722201000' },
    { city: '浦城县', name: '山下乡', id: '350722202000' },
    { city: '浦城县', name: '枫溪乡', id: '350722203000' },
    { city: '浦城县', name: '濠村乡', id: '350722204000' },
    { city: '浦城县', name: '管厝乡', id: '350722205000' },
    { city: '浦城县', name: '盘亭乡', id: '350722206000' },
    { city: '浦城县', name: '官路乡', id: '350722207000' }
  ],
  '350723000000': [
    { city: '光泽县', name: '杭川镇', id: '350723100000' },
    { city: '光泽县', name: '寨里镇', id: '350723101000' },
    { city: '光泽县', name: '止马镇', id: '350723102000' },
    { city: '光泽县', name: '鸾凤乡', id: '350723200000' },
    { city: '光泽县', name: '崇仁乡', id: '350723201000' },
    { city: '光泽县', name: '李坊乡', id: '350723202000' },
    { city: '光泽县', name: '华桥乡', id: '350723203000' },
    { city: '光泽县', name: '司前乡', id: '350723204000' }
  ],
  '350724000000': [
    { city: '松溪县', name: '松源街道', id: '350724001000' },
    { city: '松溪县', name: '郑墩镇', id: '350724101000' },
    { city: '松溪县', name: '渭田镇', id: '350724102000' },
    { city: '松溪县', name: '河东乡', id: '350724200000' },
    { city: '松溪县', name: '茶平乡', id: '350724201000' },
    { city: '松溪县', name: '旧县乡', id: '350724202000' },
    { city: '松溪县', name: '溪东乡', id: '350724203000' },
    { city: '松溪县', name: '花桥乡', id: '350724204000' },
    { city: '松溪县', name: '祖墩乡', id: '350724205000' }
  ],
  '350725000000': [
    { city: '政和县', name: '熊山街道', id: '350725001000' },
    { city: '政和县', name: '东平镇', id: '350725101000' },
    { city: '政和县', name: '石屯镇', id: '350725102000' },
    { city: '政和县', name: '铁山镇', id: '350725103000' },
    { city: '政和县', name: '镇前镇', id: '350725104000' },
    { city: '政和县', name: '星溪乡', id: '350725200000' },
    { city: '政和县', name: '外屯乡', id: '350725201000' },
    { city: '政和县', name: '杨源乡', id: '350725202000' },
    { city: '政和县', name: '澄源乡', id: '350725203000' },
    { city: '政和县', name: '岭腰乡', id: '350725204000' }
  ],
  '350781000000': [
    { city: '邵武市', name: '昭阳街道', id: '350781001000' },
    { city: '邵武市', name: '通泰街道', id: '350781002000' },
    { city: '邵武市', name: '水北街道', id: '350781003000' },
    { city: '邵武市', name: '晒口街道', id: '350781004000' },
    { city: '邵武市', name: '城郊镇', id: '350781100000' },
    { city: '邵武市', name: '水北镇', id: '350781101000' },
    { city: '邵武市', name: '下沙镇', id: '350781102000' },
    { city: '邵武市', name: '卫闽镇', id: '350781103000' },
    { city: '邵武市', name: '沿山镇', id: '350781104000' },
    { city: '邵武市', name: '拿口镇', id: '350781105000' },
    { city: '邵武市', name: '洪墩镇', id: '350781106000' },
    { city: '邵武市', name: '大埠岗镇', id: '350781107000' },
    { city: '邵武市', name: '和平镇', id: '350781108000' },
    { city: '邵武市', name: '肖家坊镇', id: '350781109000' },
    { city: '邵武市', name: '大竹镇', id: '350781110000' },
    { city: '邵武市', name: '吴家塘镇', id: '350781111000' },
    { city: '邵武市', name: '桂林乡', id: '350781200000' },
    { city: '邵武市', name: '张厝乡', id: '350781201000' },
    { city: '邵武市', name: '金坑乡', id: '350781202000' }
  ],
  '350782000000': [
    { city: '武夷山市', name: '崇安街道', id: '350782001000' },
    { city: '武夷山市', name: '新丰街道', id: '350782002000' },
    { city: '武夷山市', name: '武夷街道', id: '350782003000' },
    { city: '武夷山市', name: '星村镇', id: '350782100000' },
    { city: '武夷山市', name: '兴田镇', id: '350782101000' },
    { city: '武夷山市', name: '五夫镇', id: '350782102000' },
    { city: '武夷山市', name: '上梅乡', id: '350782200000' },
    { city: '武夷山市', name: '吴屯乡', id: '350782201000' },
    { city: '武夷山市', name: '岚谷乡', id: '350782202000' },
    { city: '武夷山市', name: '洋庄乡', id: '350782203000' }
  ],
  '350783000000': [
    { city: '建瓯市', name: '建安街道', id: '350783001000' },
    { city: '建瓯市', name: '通济街道', id: '350783002000' },
    { city: '建瓯市', name: '瓯宁街道', id: '350783003000' },
    { city: '建瓯市', name: '芝山街道', id: '350783004000' },
    { city: '建瓯市', name: '徐墩镇', id: '350783100000' },
    { city: '建瓯市', name: '吉阳镇', id: '350783101000' },
    { city: '建瓯市', name: '房道镇', id: '350783102000' },
    { city: '建瓯市', name: '南雅镇', id: '350783103000' },
    { city: '建瓯市', name: '迪口镇', id: '350783104000' },
    { city: '建瓯市', name: '小桥镇', id: '350783105000' },
    { city: '建瓯市', name: '玉山镇', id: '350783106000' },
    { city: '建瓯市', name: '东游镇', id: '350783107000' },
    { city: '建瓯市', name: '东峰镇', id: '350783108000' },
    { city: '建瓯市', name: '小松镇', id: '350783109000' },
    { city: '建瓯市', name: '顺阳乡', id: '350783200000' },
    { city: '建瓯市', name: '水源乡', id: '350783201000' },
    { city: '建瓯市', name: '川石乡', id: '350783202000' },
    { city: '建瓯市', name: '龙村乡', id: '350783203000' }
  ],
  '350401000000': [{ city: '市辖区', name: '-', id: '350401000001' }],
  '350402000000': [
    { city: '梅列区', name: '列东街道', id: '350402001000' },
    { city: '梅列区', name: '列西街道', id: '350402002000' },
    { city: '梅列区', name: '徐碧街道', id: '350402003000' },
    { city: '梅列区', name: '陈大镇', id: '350402100000' },
    { city: '梅列区', name: '洋溪镇', id: '350402101000' },
    { city: '梅列区', name: '福建梅列经济开发区', id: '350402500000' }
  ],
  '350403000000': [
    { city: '三元区', name: '城关街道', id: '350403001000' },
    { city: '三元区', name: '白沙街道', id: '350403002000' },
    { city: '三元区', name: '富兴堡街道', id: '350403003000' },
    { city: '三元区', name: '荆西街道', id: '350403004000' },
    { city: '三元区', name: '莘口镇', id: '350403100000' },
    { city: '三元区', name: '岩前镇', id: '350403101000' },
    { city: '三元区', name: '中村乡', id: '350403201000' }
  ],
  '350421000000': [
    { city: '明溪县', name: '雪峰镇', id: '350421100000' },
    { city: '明溪县', name: '盖洋镇', id: '350421101000' },
    { city: '明溪县', name: '胡坊镇', id: '350421102000' },
    { city: '明溪县', name: '瀚仙镇', id: '350421103000' },
    { city: '明溪县', name: '城关乡', id: '350421200000' },
    { city: '明溪县', name: '沙溪乡', id: '350421201000' },
    { city: '明溪县', name: '夏阳乡', id: '350421202000' },
    { city: '明溪县', name: '枫溪乡', id: '350421203000' },
    { city: '明溪县', name: '夏坊乡', id: '350421204000' }
  ],
  '350423000000': [
    { city: '清流县', name: '龙津镇', id: '350423100000' },
    { city: '清流县', name: '嵩溪镇', id: '350423101000' },
    { city: '清流县', name: '嵩口镇', id: '350423102000' },
    { city: '清流县', name: '灵地镇', id: '350423103000' },
    { city: '清流县', name: '长校镇', id: '350423104000' },
    { city: '清流县', name: '赖坊镇', id: '350423105000' },
    { city: '清流县', name: '林畲镇', id: '350423106000' },
    { city: '清流县', name: '温郊乡', id: '350423201000' },
    { city: '清流县', name: '田源乡', id: '350423203000' },
    { city: '清流县', name: '沙芜乡', id: '350423204000' },
    { city: '清流县', name: '余朋乡', id: '350423206000' },
    { city: '清流县', name: '李家乡', id: '350423208000' },
    { city: '清流县', name: '里田乡', id: '350423209000' }
  ],
  '350424000000': [
    { city: '宁化县', name: '翠江镇', id: '350424100000' },
    { city: '宁化县', name: '泉上镇', id: '350424101000' },
    { city: '宁化县', name: '湖村镇', id: '350424102000' },
    { city: '宁化县', name: '石壁镇', id: '350424103000' },
    { city: '宁化县', name: '曹坊镇', id: '350424104000' },
    { city: '宁化县', name: '安远镇', id: '350424105000' },
    { city: '宁化县', name: '淮土镇', id: '350424106000' },
    { city: '宁化县', name: '安乐镇', id: '350424107000' },
    { city: '宁化县', name: '水茜镇', id: '350424108000' },
    { city: '宁化县', name: '城郊镇', id: '350424109000' },
    { city: '宁化县', name: '城南镇', id: '350424110000' },
    { city: '宁化县', name: '济村乡', id: '350424202000' },
    { city: '宁化县', name: '方田乡', id: '350424204000' },
    { city: '宁化县', name: '治平畲族乡', id: '350424207000' },
    { city: '宁化县', name: '中沙乡', id: '350424208000' },
    { city: '宁化县', name: '河龙乡', id: '350424209000' }
  ],
  '350425000000': [
    { city: '大田县', name: '均溪镇', id: '350425100000' },
    { city: '大田县', name: '石牌镇', id: '350425101000' },
    { city: '大田县', name: '上京镇', id: '350425102000' },
    { city: '大田县', name: '广平镇', id: '350425103000' },
    { city: '大田县', name: '桃源镇', id: '350425104000' },
    { city: '大田县', name: '太华镇', id: '350425105000' },
    { city: '大田县', name: '建设镇', id: '350425106000' },
    { city: '大田县', name: '奇韬镇', id: '350425107000' },
    { city: '大田县', name: '华兴镇', id: '350425108000' },
    { city: '大田县', name: '吴山镇', id: '350425109000' },
    { city: '大田县', name: '文江镇', id: '350425110000' },
    { city: '大田县', name: '梅山镇', id: '350425111000' },
    { city: '大田县', name: '屏山乡', id: '350425201000' },
    { city: '大田县', name: '济阳乡', id: '350425203000' },
    { city: '大田县', name: '武陵乡', id: '350425204000' },
    { city: '大田县', name: '谢洋乡', id: '350425205000' },
    { city: '大田县', name: '湖美乡', id: '350425208000' },
    { city: '大田县', name: '前坪乡', id: '350425209000' },
    { city: '大田县', name: '东风农场生活区', id: '350425400000' }
  ],
  '350426000000': [
    { city: '尤溪县', name: '城关镇', id: '350426100000' },
    { city: '尤溪县', name: '梅仙镇', id: '350426101000' },
    { city: '尤溪县', name: '西滨镇', id: '350426102000' },
    { city: '尤溪县', name: '洋中镇', id: '350426103000' },
    { city: '尤溪县', name: '新阳镇', id: '350426104000' },
    { city: '尤溪县', name: '管前镇', id: '350426105000' },
    { city: '尤溪县', name: '西城镇', id: '350426106000' },
    { city: '尤溪县', name: '尤溪口镇', id: '350426107000' },
    { city: '尤溪县', name: '坂面镇', id: '350426108000' },
    { city: '尤溪县', name: '联合镇', id: '350426109000' },
    { city: '尤溪县', name: '汤川乡', id: '350426201000' },
    { city: '尤溪县', name: '溪尾乡', id: '350426202000' },
    { city: '尤溪县', name: '中仙乡', id: '350426203000' },
    { city: '尤溪县', name: '台溪乡', id: '350426204000' },
    { city: '尤溪县', name: '八字桥乡', id: '350426206000' }
  ],
  '350427000000': [
    { city: '沙县', name: '凤岗街道', id: '350427001000' },
    { city: '沙县', name: '虬江街道', id: '350427002000' },
    { city: '沙县', name: '青州镇', id: '350427101000' },
    { city: '沙县', name: '夏茂镇', id: '350427102000' },
    { city: '沙县', name: '高砂镇', id: '350427104000' },
    { city: '沙县', name: '高桥镇', id: '350427105000' },
    { city: '沙县', name: '富口镇', id: '350427106000' },
    { city: '沙县', name: '大洛镇', id: '350427107000' },
    { city: '沙县', name: '南霞乡', id: '350427201000' },
    { city: '沙县', name: '南阳乡', id: '350427203000' },
    { city: '沙县', name: '郑湖乡', id: '350427204000' },
    { city: '沙县', name: '湖源乡', id: '350427205000' },
    { city: '沙县', name: '金沙园开发区', id: '350427400000' },
    { city: '沙县', name: '金古园开发区', id: '350427401000' },
    { city: '沙县', name: '青山纸业工业区', id: '350427402000' },
    { city: '沙县', name: '海西物流园区', id: '350427403000' }
  ],
  '350428000000': [
    { city: '将乐县', name: '古镛镇', id: '350428100000' },
    { city: '将乐县', name: '万安镇', id: '350428101000' },
    { city: '将乐县', name: '高唐镇', id: '350428102000' },
    { city: '将乐县', name: '白莲镇', id: '350428103000' },
    { city: '将乐县', name: '黄潭镇', id: '350428104000' },
    { city: '将乐县', name: '水南镇', id: '350428105000' },
    { city: '将乐县', name: '光明镇', id: '350428106000' },
    { city: '将乐县', name: '南口镇', id: '350428107000' },
    { city: '将乐县', name: '漠源乡', id: '350428201000' },
    { city: '将乐县', name: '万全乡', id: '350428203000' },
    { city: '将乐县', name: '安仁乡', id: '350428204000' },
    { city: '将乐县', name: '大源乡', id: '350428205000' },
    { city: '将乐县', name: '余坊乡', id: '350428206000' }
  ],
  '350429000000': [
    { city: '泰宁县', name: '杉城镇', id: '350429100000' },
    { city: '泰宁县', name: '朱口镇', id: '350429101000' },
    { city: '泰宁县', name: '下渠镇', id: '350429103000' },
    { city: '泰宁县', name: '新桥乡', id: '350429200000' },
    { city: '泰宁县', name: '上青乡', id: '350429201000' },
    { city: '泰宁县', name: '大田乡', id: '350429202000' },
    { city: '泰宁县', name: '梅口乡', id: '350429203000' },
    { city: '泰宁县', name: '开善乡', id: '350429205000' },
    { city: '泰宁县', name: '大龙乡', id: '350429208000' }
  ],
  '350430000000': [
    { city: '建宁县', name: '濉溪镇', id: '350430100000' },
    { city: '建宁县', name: '里心镇', id: '350430101000' },
    { city: '建宁县', name: '溪口镇', id: '350430102000' },
    { city: '建宁县', name: '均口镇', id: '350430103000' },
    { city: '建宁县', name: '伊家乡', id: '350430201000' },
    { city: '建宁县', name: '黄坊乡', id: '350430202000' },
    { city: '建宁县', name: '溪源乡', id: '350430203000' },
    { city: '建宁县', name: '客坊乡', id: '350430204000' },
    { city: '建宁县', name: '黄埠乡', id: '350430205000' },
    { city: '建宁县', name: '福建建宁经济开发区', id: '350430400000' }
  ],
  '350481000000': [
    { city: '永安市', name: '燕东街道', id: '350481001000' },
    { city: '永安市', name: '燕西街道', id: '350481002000' },
    { city: '永安市', name: '燕南街道', id: '350481003000' },
    { city: '永安市', name: '燕北街道', id: '350481004000' },
    { city: '永安市', name: '西洋镇', id: '350481100000' },
    { city: '永安市', name: '贡川镇', id: '350481101000' },
    { city: '永安市', name: '安砂镇', id: '350481102000' },
    { city: '永安市', name: '小陶镇', id: '350481103000' },
    { city: '永安市', name: '大湖镇', id: '350481104000' },
    { city: '永安市', name: '曹远镇', id: '350481105000' },
    { city: '永安市', name: '洪田镇', id: '350481106000' },
    { city: '永安市', name: '槐南镇', id: '350481107000' },
    { city: '永安市', name: '上坪乡', id: '350481202000' },
    { city: '永安市', name: '罗坊乡', id: '350481203000' },
    { city: '永安市', name: '青水畲族乡', id: '350481204000' }
  ],
  '710901000000': [{ city: '南竿', name: '-', id: '710901100000' }],
  '710902000000': [{ city: '北竿', name: '-', id: '710902100000' }],
  '710903000000': [{ city: '莒光', name: '-', id: '710903100000' }],
  '710904000000': [{ city: '東引', name: '-', id: '710904100000' }],
  '990100000000': [{ city: '-', name: '-', id: '990110000000' }]
}

module.exports = {
  citys,
  provinces,
  areas
}