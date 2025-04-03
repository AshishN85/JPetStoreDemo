/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.83421103959431, "KoPercent": 0.16578896040569535};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7280359523927108, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "SignOut-111-0"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "SignOut"], "isController": true}, {"data": [1.0, 500, 1500, "SignOut-111-1"], "isController": false}, {"data": [0.4443620178041543, 500, 1500, "NavigateToWebsite"], "isController": true}, {"data": [0.4443620178041543, 500, 1500, "NavigateToWebsite-7"], "isController": false}, {"data": [1.0, 500, 1500, "EnterCredentials-74"], "isController": false}, {"data": [1.0, 500, 1500, "EnterCredentials-101"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "EnterCredentials-72"], "isController": false}, {"data": [0.82, 500, 1500, "AddtoCart"], "isController": true}, {"data": [1.0, 500, 1500, "EnterCredentials-100"], "isController": false}, {"data": [0.9921259842519685, 500, 1500, "SelectPet-26"], "isController": false}, {"data": [1.0, 500, 1500, "ProceedtoCheckout"], "isController": true}, {"data": [1.0, 500, 1500, "ClickSignIn"], "isController": true}, {"data": [0.997215677875348, 500, 1500, "SearchPet-24"], "isController": false}, {"data": [0.5, 500, 1500, "ConfirmProduct"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "EnterCredentials"], "isController": true}, {"data": [0.0, 500, 1500, "ConfirmProduct-110"], "isController": false}, {"data": [0.8260869565217391, 500, 1500, "ClickProductID-79"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "ClickCategory-77"], "isController": false}, {"data": [1.0, 500, 1500, "SelectCategory"], "isController": true}, {"data": [1.0, 500, 1500, "AddtoCart-107"], "isController": false}, {"data": [1.0, 500, 1500, "SignIn-70"], "isController": false}, {"data": [1.0, 500, 1500, "ProceedtoCheckout-108"], "isController": false}, {"data": [0.4307228915662651, 500, 1500, "NavigateWebsite"], "isController": true}, {"data": [1.0, 500, 1500, "ConfirmPaymentDetails"], "isController": true}, {"data": [0.9925925925925926, 500, 1500, "SelectPet"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "SignOut-81"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut-82"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut-112"], "isController": false}, {"data": [1.0, 500, 1500, "SelectCategory-102"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut-111"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "ClickProductID"], "isController": true}, {"data": [0.997215677875348, 500, 1500, "SearchPet"], "isController": true}, {"data": [1.0, 500, 1500, "ConfirmPaymentDetails-109"], "isController": false}, {"data": [0.9906542056074766, 500, 1500, "SelectItemID-31"], "isController": false}, {"data": [0.4306569343065693, 500, 1500, "NavigateWebsite-25"], "isController": false}, {"data": [0.42592592592592593, 500, 1500, "NavigateWebsite-69"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "AddtoCart-80"], "isController": false}, {"data": [1.0, 500, 1500, "SelectProductID-103"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "ClickCategory"], "isController": true}, {"data": [1.0, 500, 1500, "SignOut-81-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "SignOut-81-1"], "isController": false}, {"data": [1.0, 500, 1500, "ClickSignIn-99"], "isController": false}, {"data": [1.0, 500, 1500, "EnterCredentials-72-0"], "isController": false}, {"data": [0.9914529914529915, 500, 1500, "SelectItemID"], "isController": true}, {"data": [0.9961240310077519, 500, 1500, "SelectProductID"], "isController": true}, {"data": [1.0, 500, 1500, "SignIn"], "isController": true}, {"data": [0.9957264957264957, 500, 1500, "SelectProductID-30"], "isController": false}, {"data": [0.5, 500, 1500, "NavigateWebsite-98"], "isController": false}, {"data": [1.0, 500, 1500, "EnterCredentials-72-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10254, 17, 0.16578896040569535, 507.35800663155754, 0, 15773, 213.0, 775.0, 1645.0, 1845.0500000000065, 102.60156093656194, 427.4532297503502, 78.17654459863418], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["SignOut-111-0", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 1.3369605654761905, 3.7899925595238093], "isController": false}, {"data": ["SignOut", 23, 0, 0.0, 462.9999999999999, 0, 887, 507.0, 573.0, 824.9999999999991, 887.0, 0.3248037055866237, 2.827414050584647, 0.5423968130401627], "isController": true}, {"data": ["SignOut-111-1", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 28.99816176470588, 3.6937040441176467], "isController": false}, {"data": ["NavigateToWebsite", 4718, 0, 0.0, 858.2710894446801, 591, 15773, 710.0, 1650.0, 1731.0, 3666.0, 47.1823591179559, 230.18684137331866, 27.522186656207808], "isController": true}, {"data": ["NavigateToWebsite-7", 4718, 0, 0.0, 858.2687579482828, 591, 15773, 710.0, 1650.0, 1731.0, 3666.0, 47.208324994997, 230.313520143336, 27.537332946642987], "isController": false}, {"data": ["EnterCredentials-74", 24, 0, 0.0, 172.16666666666663, 145, 215, 168.0, 200.0, 212.0, 215.0, 0.30323322425360405, 1.483123373280099, 0.20018130819866828], "isController": false}, {"data": ["EnterCredentials-101", 2, 0, 0.0, 171.0, 167, 175, 171.0, 175.0, 175.0, 175.0, 0.05300400180213606, 0.25741103609572524, 0.034990923064691384], "isController": false}, {"data": ["EnterCredentials-72", 24, 4, 16.666666666666668, 186.00000000000003, 0, 385, 182.5, 358.0, 378.25, 385.0, 0.3023888720895071, 1.158369871988711, 0.29830386616772503], "isController": false}, {"data": ["AddtoCart", 25, 4, 16.0, 156.88, 0, 564, 172.0, 198.60000000000005, 457.7999999999997, 564.0, 0.32988928915455973, 1.2752411696884525, 0.17649076969768945], "isController": true}, {"data": ["EnterCredentials-100", 2, 0, 0.0, 194.5, 190, 199, 194.5, 199.0, 199.0, 199.0, 0.052959089103667416, 0.21597378525089367, 0.05280393552230902], "isController": false}, {"data": ["SelectPet-26", 127, 0, 0.0, 194.65354330708664, 152, 1303, 177.0, 206.0, 211.6, 1245.5999999999997, 1.4253647586980922, 5.32131207912458, 0.9675312149270483], "isController": false}, {"data": ["ProceedtoCheckout", 2, 0, 0.0, 185.0, 180, 190, 185.0, 190.0, 190.0, 190.0, 0.052988554472233995, 0.21842254729228486, 0.03435976579058923], "isController": true}, {"data": ["ClickSignIn", 2, 0, 0.0, 181.0, 176, 186, 181.0, 186.0, 186.0, 186.0, 0.052988554472233995, 0.2120059645241628, 0.03498072541331072], "isController": true}, {"data": ["SearchPet-24", 4669, 0, 0.0, 179.84364960376942, 144, 1406, 174.0, 196.0, 206.0, 235.0, 47.549214302445186, 165.77343614743413, 45.87756223712485], "isController": false}, {"data": ["ConfirmProduct", 2, 1, 50.0, 173.0, 0, 346, 173.0, 346.0, 346.0, 346.0, 0.05342451116572284, 0.4022229187813869, 0.016721245926381023], "isController": true}, {"data": ["EnterCredentials", 28, 4, 14.285714285714286, 333.1071428571429, 0, 571, 350.0, 512.9000000000001, 560.65, 571.0, 0.3317889348390231, 2.6921283815809742, 0.507565787524736], "isController": true}, {"data": ["ConfirmProduct-110", 1, 1, 100.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 43.519124819364166, 1.8091808164739887], "isController": false}, {"data": ["ClickProductID-79", 23, 4, 17.391304347826086, 143.43478260869563, 0, 207, 167.0, 203.20000000000002, 206.8, 207.0, 0.30270725576130875, 1.0518665850673194, 0.16658410079493557], "isController": false}, {"data": ["ClickCategory-77", 24, 4, 16.666666666666668, 148.62500000000006, 0, 222, 170.5, 206.5, 218.75, 222.0, 0.3034095649865362, 1.0179948933957852, 0.16077892109455], "isController": false}, {"data": ["SelectCategory", 2, 0, 0.0, 186.5, 170, 203, 186.5, 203.0, 203.0, 203.0, 0.05296469902809777, 0.1896694837265962, 0.03374947862874394], "isController": true}, {"data": ["AddtoCart-107", 2, 0, 0.0, 180.0, 179, 181, 180.0, 181.0, 181.0, 181.0, 0.05300119252683186, 0.24210261527759375, 0.035454899297734196], "isController": false}, {"data": ["SignIn-70", 26, 0, 0.0, 174.15384615384613, 145, 228, 170.5, 214.9, 226.6, 228.0, 0.3074448964147195, 1.2296872043799074, 0.20296166989877967], "isController": false}, {"data": ["ProceedtoCheckout-108", 2, 0, 0.0, 185.0, 180, 190, 185.0, 190.0, 190.0, 190.0, 0.05306728932286139, 0.21874709788261515, 0.03441082042029293], "isController": false}, {"data": ["NavigateWebsite", 166, 0, 0.0, 900.4518072289154, 616, 3794, 708.0, 1697.0, 1769.6000000000001, 3751.790000000001, 1.7470557900165233, 8.761456420298474, 0.9990091411273773], "isController": true}, {"data": ["ConfirmPaymentDetails", 2, 0, 0.0, 192.5, 181, 204, 192.5, 204.0, 204.0, 204.0, 0.05306588129162355, 0.23262962999814268, 0.06695421741091565], "isController": true}, {"data": ["SelectPet", 135, 0, 0.0, 183.11851851851856, 0, 1303, 176.0, 203.60000000000002, 211.2, 1229.199999999997, 1.45800933125972, 5.120624959499741, 0.9310418961681355], "isController": true}, {"data": ["SignOut-81", 19, 0, 0.0, 363.4210526315789, 298, 722, 340.0, 398.0, 722.0, 722.0, 0.31007751937984496, 1.598231589147287, 0.3981952519379845], "isController": false}, {"data": ["SignOut-82", 19, 0, 0.0, 170.36842105263156, 149, 197, 167.0, 194.0, 197.0, 197.0, 0.3110725453920333, 1.5107068049165835, 0.1983695040439431], "isController": false}, {"data": ["SignOut-112", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 28.90741257440476, 3.7376767113095237], "isController": false}, {"data": ["SelectCategory-102", 2, 0, 0.0, 186.5, 170, 203, 186.5, 203.0, 203.0, 203.0, 0.05301524188204109, 0.18985048045062955, 0.03378168489065606], "isController": false}, {"data": ["SignOut-111", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 15.204415560471976, 3.7305263643067845], "isController": false}, {"data": ["ClickProductID", 24, 4, 16.666666666666668, 137.45833333333331, 0, 207, 164.0, 202.5, 206.75, 207.0, 0.304213354966283, 1.0130542387060792, 0.1604373898811033], "isController": true}, {"data": ["SearchPet", 4669, 0, 0.0, 179.84364960376936, 144, 1406, 174.0, 196.0, 206.0, 235.0, 47.54582484725051, 165.7616193037169, 45.87429194246436], "isController": true}, {"data": ["ConfirmPaymentDetails-109", 2, 0, 0.0, 192.5, 181, 204, 192.5, 204.0, 204.0, 204.0, 0.053134962805526036, 0.23293246878320936, 0.0670413788522848], "isController": false}, {"data": ["SelectItemID-31", 107, 0, 0.0, 191.79439252336454, 149, 807, 180.0, 209.0, 223.2, 799.1600000000002, 1.4285523557762914, 5.316562132848694, 0.942807005246926], "isController": false}, {"data": ["NavigateWebsite-25", 137, 0, 0.0, 915.6350364963504, 616, 3794, 713.0, 1705.4, 1786.9999999999995, 3770.0600000000004, 1.4418624231708344, 7.2153863395375515, 0.8256833059695209], "isController": false}, {"data": ["NavigateWebsite-69", 27, 0, 0.0, 835.0740740740741, 624, 1754, 698.0, 1700.6, 1748.0, 1754.0, 0.30127203749163134, 1.5233481470374917, 0.17131796055567952], "isController": false}, {"data": ["AddtoCart-80", 22, 4, 18.181818181818183, 161.9090909090909, 0, 564, 171.5, 204.29999999999998, 510.89999999999924, 564.0, 0.3098460628424151, 1.232424818317536, 0.16952958853851247], "isController": false}, {"data": ["SelectProductID-103", 2, 0, 0.0, 177.0, 172, 182, 177.0, 182.0, 182.0, 182.0, 0.053092646668436425, 0.20666727501990972, 0.03536053225378285], "isController": false}, {"data": ["ClickCategory", 24, 4, 16.666666666666668, 148.62500000000006, 0, 222, 170.5, 206.5, 218.75, 222.0, 0.30327920641940986, 1.0175575164276236, 0.16070984314778541], "isController": true}, {"data": ["SignOut-81-0", 19, 0, 0.0, 176.7894736842105, 146, 208, 175.0, 205.0, 208.0, 208.0, 0.3109910794664048, 0.06985151198952451, 0.20105087363941404], "isController": false}, {"data": ["SignOut-81-1", 19, 0, 0.0, 186.47368421052633, 151, 547, 168.0, 190.0, 547.0, 547.0, 0.31109801224743755, 1.5336159822510398, 0.19838574413825852], "isController": false}, {"data": ["ClickSignIn-99", 2, 0, 0.0, 181.0, 176, 186, 181.0, 186.0, 186.0, 186.0, 0.0529829394934831, 0.21198349912578152, 0.0349770186499947], "isController": false}, {"data": ["EnterCredentials-72-0", 5, 0, 0.0, 185.8, 155, 209, 189.0, 209.0, 209.0, 209.0, 0.06563833278634722, 0.01474298490318346, 0.06583063258943223], "isController": false}, {"data": ["SelectItemID", 117, 0, 0.0, 175.4017094017094, 0, 807, 178.0, 209.0, 222.2, 789.3599999999993, 1.3598484408233475, 4.628317627035414, 0.8207578830530341], "isController": true}, {"data": ["SelectProductID", 129, 0, 0.0, 173.03875968992244, 0, 880, 177.0, 200.0, 210.5, 733.5999999999945, 1.4518525187953002, 5.2352793303752305, 0.9488105044062035], "isController": true}, {"data": ["SignIn", 27, 0, 0.0, 167.7037037037037, 0, 228, 169.0, 213.6, 226.39999999999998, 228.0, 0.3037872139337069, 1.170055441166543, 0.1931193602466302], "isController": true}, {"data": ["SelectProductID-30", 117, 0, 0.0, 187.76068376068383, 153, 880, 181.0, 206.2, 211.29999999999998, 792.1599999999967, 1.3570094758695879, 5.3048618380229415, 0.9623363723483224], "isController": false}, {"data": ["NavigateWebsite-98", 2, 0, 0.0, 743.0, 708, 778, 743.0, 778.0, 778.0, 778.0, 0.05225206395652628, 0.2713892599148291, 0.029162162647612077], "isController": false}, {"data": ["EnterCredentials-72-1", 5, 0, 0.0, 162.4, 145, 175, 168.0, 175.0, 175.0, 175.0, 0.06568921120395185, 0.32992149728703557, 0.04901030992169846], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 1, 5.882352941176471, 0.009752291788570315], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 79: https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&amp;productId=NOT FOUND", 4, 23.529411764705884, 0.03900916715428126], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 81: https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&amp;categoryId=NOT FOUND", 4, 23.529411764705884, 0.03900916715428126], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 82: https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&amp;workingItemId=NOT FOUND", 4, 23.529411764705884, 0.03900916715428126], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalArgumentException/Non HTTP response message: URLDecoder: Incomplete trailing escape (%) pattern", 4, 23.529411764705884, 0.03900916715428126], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10254, 17, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 79: https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&amp;productId=NOT FOUND", 4, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 81: https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&amp;categoryId=NOT FOUND", 4, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 82: https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&amp;workingItemId=NOT FOUND", 4, "Non HTTP response code: java.lang.IllegalArgumentException/Non HTTP response message: URLDecoder: Incomplete trailing escape (%) pattern", 4, "500", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["EnterCredentials-72", 24, 4, "Non HTTP response code: java.lang.IllegalArgumentException/Non HTTP response message: URLDecoder: Incomplete trailing escape (%) pattern", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ConfirmProduct-110", 1, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ClickProductID-79", 23, 4, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 79: https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&amp;productId=NOT FOUND", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ClickCategory-77", 24, 4, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 81: https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&amp;categoryId=NOT FOUND", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["AddtoCart-80", 22, 4, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 82: https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&amp;workingItemId=NOT FOUND", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
