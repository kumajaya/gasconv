var Product;
var VNewID, PNewID, MNewID, TNewID, VGNewID, VGTemp;
var PVal, LVal, WVal, GVal;
var FConv, FPress;
var cordovaready;

function init() {
    Product = 1;
    FConv = 1;
    FPress = true;
    VNewID = 4;
    PNewID = 2;
    MNewID = 1;
    TNewID = 1;
    VGNewID = 6;
    VGTemp = 30.0;
    PVal = 1.01325;
    LVal = VCvt(4, 1, 1); // 1 m3
    showTab();
}

function showTab() {
    var LabVal, TempVal;
    document.getElementById("ProductSel").value = Product;
    LabVal = document.getElementById("Disp1");
    LabVal.innerHTML = PStr(parseInt(PNewID));
    LabVal = document.getElementById("Disp2");
    LabVal.innerHTML = TStr(parseInt(TNewID));
    LabVal = document.getElementById("Disp3");
    LabVal.innerHTML = VStr(parseInt(VNewID));
    LabVal = document.getElementById("Disp4");
    LabVal.innerHTML = MStr(parseInt(MNewID));
    LabVal = document.getElementById("Disp5");
    LabVal.innerHTML = VGStr(parseInt(VGNewID));
    LabVal = document.getElementById("Disp6");
    LabVal.innerHTML = TStr(parseInt(TNewID));
    LabVal = document.getElementById("Lab5");
    if (VGNewID == 2) {
        TempVal = TCvt(3, TNewID, 60.0).toFixed(2) + " " + TStr(parseInt(TNewID));
    } else if (VGNewID == 4) {
        TempVal = TCvt(1, TNewID, 0.0).toFixed(2) + " " + TStr(parseInt(TNewID));
    } else if (VGNewID == 5) {
        TempVal = TCvt(1, TNewID, 15.0).toFixed(2) + " " + TStr(parseInt(TNewID));
    } else {
        TempVal = TCvt(1, TNewID, VGTemp).toFixed(2) + " " + TStr(parseInt(TNewID));
    }
    LabVal.innerHTML = "Gas @ " + TempVal;
    TempVal = PCvt(2, PNewID, PVal);
    document.getElementById("Inp1").value = TempVal.toFixed(5);
    TempVal = VCvt(1, VNewID, LVal);
    document.getElementById("Inp3").value = TempVal.toFixed(4);
    TempVal = TCvt(1, TNewID, VGTemp);
    document.getElementById("Inp6").value = TempVal.toFixed(2);
    UpdateOptChange();
    updateTab();
    CalcTab();
}

function changeHandler() {
    FConv = 1;
    FPress = true;
    Product = document.getElementById("ProductSel").value;
    // reset pressure
    if (parseInt(Product) == 4)
        PVal = 1.01325*21.42;
    else
        PVal = 1.01325;
    var TempVal = PCvt(2, PNewID, PVal);
    document.getElementById("Inp1").value = TempVal.toFixed(5);
    CalcTab();
}

function setFocus(s) {
    switch (s) {
        case 'Inp3':
            FConv = 1;
            break;
        case 'Inp4':
            FConv = 2;
            break;
        case 'Inp5':
            FConv = 3;
            break;
        case 'Inp1':
            FPress = true;
            break;
        case 'Inp2':
            FPress = false;
            break;
        default:
            return;
    }
}

function updateTab() {
    var tempVal;
    if (FPress) {
        tempVal = TCvt(1, TNewID, LiqTemp(parseInt(Product), PVal));
        document.getElementById("Inp2").value = tempVal.toFixed(5);
    } else {
        tempVal = PCvt(2, PNewID, PVal);
        document.getElementById("Inp1").value = tempVal.toFixed(5);
    }

    if (FConv == 1) { // liquid
        tempVal = VCvt(1, 5, LVal) * LiqDs(parseInt(Product), PVal);
        tempVal = MCvt(1, MNewID, tempVal);
        document.getElementById("Inp4").value =  tempVal.toFixed(4); // weight
        tempVal = LVal * LiqDs(parseInt(Product), PVal) / GasDs(parseInt(Product));
        tempVal = VGCvt(1, VGNewID, tempVal);
        document.getElementById("Inp5").value = tempVal.toFixed(4); // gas
    } else if (FConv == 2) { // weight
        tempVal = WVal * (1 / GasDs(parseInt(Product)));
        tempVal = VGCvt(4, VGNewID, tempVal)
        document.getElementById("Inp5").value = tempVal.toFixed(4); // gas
        tempVal = WVal * (1 / LiqDs(parseInt(Product), PVal));
        tempVal = VCvt(5, VNewID, tempVal);
        document.getElementById("Inp3").value = tempVal.toFixed(4); // liquid
    } else if (FConv == 3) { // gas
        tempVal = GVal * GasDs(parseInt(Product)) / LiqDs(parseInt(Product), PVal);
        tempVal = VCvt(1, VNewID, tempVal);
        document.getElementById("Inp3").value = tempVal.toFixed(4); // liquid
        tempVal = VGCvt(1, 4, GVal) * GasDs(parseInt(Product));
        tempVal = MCvt(1, MNewID, tempVal);
        document.getElementById("Inp4").value = tempVal.toFixed(4); // weight
    }

    if (VGNewID == 2) {
        tempVal = TCvt(3, TNewID, 60.0).toFixed(2) + " " + TStr(parseInt(TNewID));
    } else if (VGNewID == 4) {
        tempVal = TCvt(1, TNewID, 0.0).toFixed(2) + " " + TStr(parseInt(TNewID));
    } else if (VGNewID == 5) {
        tempVal = TCvt(1, TNewID, 15.0).toFixed(2) + " " + TStr(parseInt(TNewID));
    } else {
        tempVal = TCvt(1, TNewID, VGTemp).toFixed(2) + " " + TStr(parseInt(TNewID));
    }
    document.getElementById("Lab5").innerHTML = "Gas @ " + tempVal;
}

function CalcTab() {
    var tempVal;
    var IT1;
    IT1 = document.getElementById("Inp1");
    if (IT1.value == "" || !isNumeric(IT1.value)) {
        ErrorRep("Vessel pressure is Incorrect !!", 1, 0);
        return false;
    }
    tempVal = parseFloat(IT1.value);
    if (!IsProb(tempVal) && tempVal > 0) {
        tempVal = PCvt(PNewID, 2, tempVal);
        if (LiqDs(parseInt(Product), tempVal) > 0) {          
            if (document.activeElement == IT1) {
                PVal = tempVal; 
                ErrorRep("Vessel pressure"  + getPressRep(Product), 1, 1);
            } else {
                ErrorRep("", 1, 0);
            }
        } else {
            ErrorRep("Vessel pressure Out of Range !!", 1, 0);
            return false;
        }
    } else {
        ErrorRep("Vessel pressure is not Correct", 1, 0);
        return false;
    }
    if (!FPress) {
        IT1 = document.getElementById("Inp2");
        if (IT1.value == "" || !isNumeric(IT1.value)) {
            ErrorRep("Liquid temperature is Incorrect !!", 2, 0);
            return false;
        }
        tempVal = parseFloat(IT1.value);
        if (!IsProb(tempVal)) {
            tempVal = LiqPress(parseInt(Product), TCvt(TNewID, 1, tempVal));
            if (!IsProb(tempVal)) {
                if (document.activeElement == IT1) {
                    PVal = roundToFives(tempVal);
                    ErrorRep("Get vessel pressure from known liquid temperature" + getTempRep(Product), 2, 1);
                } else {
                    ErrorRep("", 2, 0);
                }
            } else {
                ErrorRep("Liquid temperature Out of Range !!", 2, 0);
                return false;
            }
        } else {
            ErrorRep("Liquid temperature is not Correct", 2, 0);
            return false;
        }
    }
    IT1 = document.getElementById("Inp3");
    if (IT1.value == "" || !isNumeric(IT1.value)) {
        ErrorRep("Liquid volume is Incorrect !!", 3, 0);
        return false;
    }
    tempVal = parseFloat(IT1.value);
    if (!IsProb(tempVal) && tempVal > 0) {
        if (document.activeElement == IT1) {
            LVal = VCvt(VNewID, 1, tempVal);
            ErrorRep("Get weight and gas volume from known liquid volume", 3, 1);
        } else {
            ErrorRep("", 3, 0);
        }
    } else {
        ErrorRep("Liquid volume is not Correct", 3, 0);
        return false;
    }
    IT1 = document.getElementById("Inp4");
    if (IT1.value == "" || !isNumeric(IT1.value)) {
        ErrorRep("Product weight is Incorrect !!", 4, 0);
        return false;
    }
    tempVal = parseFloat(IT1.value);
    if (!IsProb(tempVal) && tempVal > 0) {
        if (document.activeElement == IT1) {
            WVal = MCvt(MNewID, 1, tempVal);
            ErrorRep("Get liquid and gas volume from known weight", 4, 1);
        } else {
            ErrorRep("", 4, 0);
        }
    } else {
        ErrorRep("Product weight is not Correct", 4, 0);
        return false;
    }
    IT1 = document.getElementById("Inp5");
    if (IT1.value == "" || !isNumeric(IT1.value)) {
        ErrorRep("Gas volume is Incorrect !!", 5, 0);
        return false;
    }
    tempVal = parseFloat(IT1.value);
    if (!IsProb(tempVal) && tempVal > 0) {
        if (document.activeElement == IT1) {
            GVal = VGCvt(VGNewID, 1, tempVal);
            ErrorRep("Get liquid volume and weight from known gas volume", 5, 1);
        } else {
            ErrorRep("", 5, 0);
        }
    } else {
        ErrorRep("Gas volume is not Correct", 5, 0);
        return false;
    }
    IT1 = document.getElementById("Inp6");
    if (IT1.value == "" || !isNumeric(IT1.value)) {
        ErrorRep("Temperature is Incorrect !!", 6, 0);
        return false;
    }
    tempVal = parseFloat(IT1.value);
    if (!IsProb(tempVal) && tempVal >= 0) {
        if (document.activeElement == IT1) {
            VGTemp = TCvt(TNewID, 1, tempVal);
            ErrorRep("Gas phase temperature setting", 6, 1);
        } else {
            ErrorRep("", 6, 0);
        }
    } else {
        ErrorRep("Temperature is not Correct", 6, 0);
        return false;
    }
    updateTab();
}

function getPressRep(prod) {
    var tempVal;
    tempVal = " ";
    switch (parseInt(prod)) {
        case 1:
            tempVal += " (gauge pressure + " + PCvt(2, PNewID, 1.01325).toFixed(5);
            tempVal += ", in range about " + PCvt(2, PNewID, 0.00152).toFixed(3);
            tempVal += " to " + PCvt(2, PNewID, 49.20884).toFixed(2);
            tempVal += " " + PStr(parseInt(PNewID)) + ")";
            break;
        case 2:
            tempVal += " (gauge pressure + " + PCvt(2, PNewID, 1.01325).toFixed(5);
            tempVal += ", in range about " + PCvt(2, PNewID, 0.01574).toFixed(3);
            tempVal += " to " + PCvt(2, PNewID, 33.6387).toFixed(2);
            tempVal += " " + PStr(parseInt(PNewID)) + ")";
            break;
        case 3:
            tempVal += " (gauge pressure + " + PCvt(2, PNewID, 1.01325).toFixed(5);
            tempVal += ", in range about " + PCvt(2, PNewID, 0.68893).toFixed(3);
            tempVal += " to " + PCvt(2, PNewID, 48.63).toFixed(2);
            tempVal += " " + PStr(parseInt(PNewID)) + ")";
            break;
        case 4:
            tempVal += " (gauge pressure + " + PCvt(2, PNewID, 1.01325).toFixed(5);
            tempVal += ", in range about " + PCvt(2, PNewID, 5.26159).toFixed(3);
            tempVal += " to " + PCvt(2, PNewID, 73.6998).toFixed(2);
            tempVal += " " + PStr(parseInt(PNewID)) + ")";
            break;
        case 5:
            tempVal += " (gauge pressure + " + PCvt(2, PNewID, 1.01325).toFixed(5);
            tempVal += ", in range about " + PCvt(2, PNewID, 0.92287).toFixed(3);
            tempVal += " to " + PCvt(2, PNewID, 27.442283).toFixed(2);
            tempVal += " " + PStr(parseInt(PNewID)) + ")";
            break;
        default:
            return tempVal;
    }
    return tempVal;
}

function getTempRep(prod) {
    var tempVal;
    tempVal = " ";
    switch (parseInt(prod)) {
        case 1:
            tempVal += " (about " + TCvt(1, TNewID, -218.79).toFixed(2);
            tempVal += " to " + TCvt(1, TNewID, -118.57).toFixed(2);
            tempVal += " " + TStr(parseInt(TNewID)) + ")";
            break;
        case 2:
            tempVal += " (about " + TCvt(1, TNewID, -218.00).toFixed(2);
            tempVal += " to " + TCvt(1, TNewID, -146.00).toFixed(2);
            tempVal += " " + TStr(parseInt(TNewID)) + ")";
            break;
        case 3:
            tempVal += " (about " + TCvt(1, TNewID, -189.3442).toFixed(2);
            tempVal += " to " + TCvt(1, TNewID, -122.463).toFixed(2);
            tempVal += " " + TStr(parseInt(TNewID)) + ")";
            break;
        case 4:
            tempVal += " (about " + TCvt(1, TNewID, -56.57).toFixed(2);
            tempVal += " to " + TCvt(1, TNewID, 31.00).toFixed(2);
            tempVal += " " + TStr(parseInt(TNewID)) + ")";
            break;
        case 5:
            tempVal += " (about " + TCvt(1, TNewID, -90.00).toFixed(2);
            tempVal += " to " + TCvt(1, TNewID, -5.00).toFixed(2);
            tempVal += " " + TStr(parseInt(TNewID)) + ")";
            break;
        default:
            return tempVal;
    }
    return tempVal;
}

function UpdateOptChange() {
    if (VGNewID == 3 || VGNewID == 6) {
        document.getElementById("VGOptIn").className = "";
    } else {
        document.getElementById("VGOptIn").className = "hidden";
    }
}

function OptChange() {
    VNewID = parseInt(document.getElementById("VOpt").value);
    PNewID = parseInt(document.getElementById("POpt").value);
    MNewID = parseInt(document.getElementById("MOpt").value);
    TNewID = parseInt(document.getElementById("TOpt").value);
    VGNewID = parseInt(document.getElementById("VGOpt").value);
    UpdateOptChange();
    showTab();
}

function PrintRes(num, tex, val, unt, comp) {
    if (num == 1) {
        comp.innerHTML = "<div class=\"row\">" + "<div class=\"col-xs-5\">" + tex + "</div>" + "<div class=\"col-xs-3\">" + val + "</div>" + "<div class=\"col-xs-4 \">" + unt + "</div>" + "</div><br />";
    } else if (num == 2) {
        comp.innerHTML += "<div class=\"row\">" + "<div class=\"col-xs-5\">" + tex + "</div>" + "<div class=\"col-xs-3\">" + val + "</div>" + "<div class=\"col-xs-4 \">" + unt + "</div>" + "</div><br />";
    } else if (num == 3) {
        comp.innerHTML = "<h5 class=\"text-info\">" + tex + "</h5><br/>";
    } else if (num == 5) {
        comp.innerHTML = "<div class=\"alert alert-danger\">" + tex + "</div>";
    }
}

function ErrorRep(mess, num, flg) {
    var ResV;
    if (mess == "") {
        document.getElementById("Res" + parseInt(num)).className = "calcs hide";
        flg = 2;
    } else {
        document.getElementById("Res" + parseInt(num)).className = "";
    }
    if (flg == 2) {
        document.getElementById("Grp" + parseInt(num)).className = "form-group";
    } else if (flg == 1) {
        document.getElementById("Grp" + parseInt(num)).className = "form-group has-success";
    } else {
        document.getElementById("Grp" + parseInt(num)).className = "form-group has-error";
    }
    ResV = document.getElementById("Res" + parseInt(num));
    if (flg == 1) {
        ResV.innerHTML = "<div class=\"help-block\">" + mess + "</div>";
    } else if (flg == 0) {
        ResV.innerHTML = "<div class=\"help-block\">" + mess + "</div>";
    }
}

function roundToFives(num) {
    return +(Math.round(num + "e+5") + "e-5");
}

function log10(val) {
    if (Math.log10) {
        return Math.log10(val)
    } else {
        return Math.log(val) / Math.log(10);
    }
}

function isNumeric(value) {
    if (value != null && !value.toString().match(/^[-]?\d*\.?\d*$/)) {
        return false;
    }
    return true;
}

function IsProb(n) {
    if (isNaN(n)) {
        return true;
    } else if (!isFinite(n)) {
        return true;
    } else {
        return false;
    }
}

function VFStr(i) {
    switch (i) {
        case 1:
            return "ft<sup>3</sup>/min";
            break;
        case 2:
            return "US gpm";
            break;
        case 3:
            return "barrel/day";
            break;
        case 4:
            return "m<sup>3</sup>/h";
            break;
        case 5:
            return "liter/h";
            break;
        default:
            return "";
    }
}

function VFCvt(i, j, VF) {
    var VUnitVal = new Array(6);
    VUnitVal[1] = 1;
    VUnitVal[2] = 0.1336805462721843;
    VUnitVal[3] = 0.0038990154985866065;
    VUnitVal[4] = 0.5885783333333333;
    VUnitVal[5] = 1 / 1699.008;
    return VF * VUnitVal[i] / VUnitVal[j];
}

function VCvt(i, j, V) {
    var VUnitVal = new Array(7);
    VUnitVal[1] = 1;
    VUnitVal[2] = 1728;
    VUnitVal[3] = 231;
    VUnitVal[4] = 1 / Math.pow(0.0254, 3);
    VUnitVal[5] = VUnitVal[4] / 1000;
    VUnitVal[6] = 9702;
    return V * VUnitVal[i] / VUnitVal[j];
}

function VStr(i) {
    switch (i) {
        case 1:
            return "in&#xB3;";
            break;
        case 2:
            return "ft&#xB3;";
            break;
        case 3:
            return "Gallon(US)";
            break;
        case 4:
            return "m&#xB3;";
            break;
        case 5:
            return "liter";
            break;
        case 6:
            return "barrel";
            break;
        default:
            return "";
    }
}

function VGCvt(i, j, V) {
    var VGUnitVal = new Array(7);
    VGUnitVal[1] = 1000;
    VGUnitVal[2] = 1728 * 491.67 / 519.67;
    VGUnitVal[3] = 1728 * 273.15 / (VGTemp + 273.15);
    VGUnitVal[4] = 1 / Math.pow(0.0254, 3);
    VGUnitVal[5] = (1 / Math.pow(0.0254, 3)) * (273.15 / 288.15);
    VGUnitVal[6] = (1 / Math.pow(0.0254, 3)) * (273.15 / (VGTemp + 273.15));
    return V * VGUnitVal[i] / VGUnitVal[j];
}

function VGStr(i) {
    switch (i) {
        case 1:
            return "in&#xB3;";
            break;
        case 2:
            return "SCF";
            break;
        case 3:
            return "ACF";
            break;
        case 4:
            return "Nm&#xB3;";
            break;
        case 5:
            return "Sm&#xB3;";
            break;
        case 6:
            return "m&#xB3;";
            break;
        default:
            return "";
    }
}

function MCvt(i, j, M) {
    var MUnitVal = new Array(5);
    MUnitVal[1] = 1;
    MUnitVal[2] = 1000;
    MUnitVal[3] = 1 / 2.20462262;
    MUnitVal[4] = MUnitVal[3] * 2000;
    return M * MUnitVal[i] / MUnitVal[j];
}

function MStr(i) {
    switch (i) {
        case 1:
            return "kg";
            break;
        case 2:
            return "metric ton";
            break;
        case 3:
            return "lb";
            break;
        case 4:
            return "short ton";
            break;
        default:
            return "";
    }
}

function PCvt(i, j, P) {
    var PUnitVal = new Array(5);
    PUnitVal[1] = 1;
    PUnitVal[2] = 1 / 1.01325;
    PUnitVal[3] = 1 / 14.69595;
    PUnitVal[4] = 1 / 101.325;
    return P * PUnitVal[i] / PUnitVal[j];
}

function PStr(i) {
    switch (i) {
        case 1:
            return "atm-abs.";
            break;
        case 2:
            return "bar-abs.";
            break;
        case 3:
            return "PSI-abs.";
            break;
        case 4:
            return "kPa-abs.";
            break;
        default:
            return "";
    }
}

function TCvt(i, j, T) {
    var TOld;
    TOld = T;
    if (i == 1) {
        TOld = T;
    } else if (i == 2) {
        TOld = T - 273.15;
    } else if (i == 3) {
        TOld = (T - 32) * 5 / 9;
    } else if (i == 4) {
        TOld = (T - 459.67 - 32) * 5 / 9;
    }
    if (j == 1) {
        return TOld;
    } else if (j == 2) {
        return TOld + 273.15;
    } else if (j == 3) {
        return TOld * 9 / 5 + 32;
    } else if (j == 4) {
        return TOld * 9 / 5 + 32 + 459.67;
    }
    return TOld;
}

function TStr(i) {
    switch (i) {
        case 1:
            return "&#176C";
            break;
        case 2:
            return "&#176K";
            break;
        case 3:
            return "&#176F";
            break;
        case 4:
            return "&#176R";
            break;
        default:
            return "";
    }
}

function O2Press(T) {
    if (T>=-218.79 && T<=-118.57) {
        // pow(10,A - (B/(C + T+ 273.15)))
        return Math.pow(10,3.9523 - (340.024/(-4.144 + T+ 273.15)));
    } else {
        return 'NaN';
    }
}

function O2Temp(p) {
    // T = (B/(A - log10(p)) - C) - 273.15
    var T = (340.024/(3.9523 - log10(p)) - -4.144) - 273.15;
    if (T>=-218.79 && T<=-118.57) {
        return T;
    } else {
        return 'NaN';
    }
}

function O2Ds(p) {
    var T = O2Temp(p);
    if (isNaN(T)) {
        return 0;
    } else {
        // A/pow(B,pow(1 - (T + 273.15)/Tc,C));
        return 0.43533/Math.pow(0.28772,Math.pow(1 - (T + 273.15)/154.58,0.2924));
    }
}

function N2Press(T) {
    if (T>=-195 && T<=-146) {
        // pow(10,A - (B/(C + T)))/750.06156130264
        return Math.pow(10,6.93878 - (330.16/(277.196 + T)))/750.06156130264;
    } else {
        if (T>=-218 && T<=-195) {
            // pow(10,A - (B/(C + T)))/750.06156130264
            return Math.pow(10,5.73921 - (167.93/(254.481 + T)))/750.06156130264;
        } else {
            return 'NaN';
        }
    }
}

function N2Temp(p) {
    // T = B/(A - log10(p*750.06156130264)) - C;
    var T = 330.16/(6.93878 - log10(p*750.06156130264)) - 277.196;
    if (T>=-195 && T<=-146) {
        return T;
    } else {
        // T = B/(A - log10(p*750.06156130264)) - C;
        T = 167.93/(5.73921 - log10(p*750.06156130264)) - 254.481;
        if (T>=-218 && T<=-195) {
            return T;
        } else {
            var temp = Number((T).toFixed(0)); /* round to nearest decimal value */
            if (temp>=-218 && temp<=-195) {
                return T;
            } else {
                return 'NaN';
            }
        }
    }
}

function N2Ds(p) {
    var T = N2Temp(p);
    if (isNaN(T)) {
        return 0;
    } else {
        // A/pow(B,pow(1 - (T + 273.15)/Tc,C))
        return 0.31205/Math.pow(0.28479,Math.pow(1 - (T + 273.15)/126.1,0.2925));
    }
}

function secant(f, x1, x2, E, y, verbose) {
    var n = 0, xm, x0, c;
    if (f(x1,y) * f(x2,y) < 0)
    {
        do {
            // calculate the intermediate value
            x0 = (x1 * f(x2,y) - x2 * f(x1,y)) / (f(x2,y) - f(x1,y));
            // check if x0 is root of equation or not
            c = f(x1,y) * f(x0,y);
            // update the value of interval
            x1 = x2;
            x2 = x0;
            // update number of iteration
            if (verbose) n++;
            // if x0 is the root of equation then break the loop
            if (c == 0)
                break;
            xm = (x1 * f(x2,y) - x2 * f(x1,y)) / (f(x2,y) - f(x1,y));
            // repeat the loop until the 
            // convergence 
        } while (Math.abs(xm - x0) >= E); 
                       
        if (verbose) console.log("No. of iterations = " + n);
        return x0;
    } else
        return 'NaN';

    // This code based on Anant Agarwal contribution on GeeksForGeeks
}

function Ar_f(x, y) {
    return -y + 4.863 * Math.exp((-5.9409785*(1 - x) + 1.3553888*Math.pow(1 - x,1.5) - 0.46497607*Math.pow(1 - x,2) - 1.5399043*Math.pow(1 - x,4.5))/x);
}

function ArPress(T) {
    if (T>-189.3442 && T<-122.463)
        return Ar_f((T + 273.15)/150.687, 0)*10.;
    else
        return 'NaN';
}

function ArTemp(p) {
    // 83.8058 - 150.687 K
    // -189.3442 - -122.463 C
    // 0.6889294344117788 - 48.63 bar
    // x1 = 0.55615812910246 x2 = 1.0
    return -273.15 + secant(Ar_f, 0.55615812910246, 1.0, 0.00000000000001, p/10.)*150.687;
}

function ArDs(p) {
    var T = ArTemp(p);
    if (isNaN(T)) {
        return 0;
    } else {
        var rho_c = 0.5356;
        // t = 1 - (T + 273.15)/Tc
        T = 1 - (T + 273.15)/150.687;
        // rho_c*exp(A*pow(T,0.334) + B*pow(T,2./3.) + C*pow(T,7./3.) + D*pow(T,4.))
        return 0.5356*Math.exp(1.5004262*Math.pow(T,0.334) + -0.3138129*Math.pow(T,2./3.) + 0.086461622*Math.pow(T,7./3.) + -0.041477525*Math.pow(T,4.));
    }
}

function CO2Press(T) {
    if (T>=-56.57 && T<=31) {
        // pow(10,A - (B/(C + T)))/750.06156130264
        return Math.pow(10,7.8101 - (987.44/(290.9 + T)))/750.06156130264;
    } else {
        return 'NaN';
    }
}

function CO2Temp(p) {
    // T = B/(A - log10(p*750.06156130264)) - C
    var T = 987.44/(7.8101 - log10(p*750.06156130264)) - 290.9;
    if (T>=-56.57 && T<=31) {
        return T;
    } else {
        return 'NaN';
    }
}

function CO2Ds(p) {
    var T = CO2Temp(p);
    if (isNaN(T)) {
        return 0;
    } else {
        // A/pow(B,pow(1 - (T + 273.15)/Tc,C))
        return 0.46382/Math.pow(0.2616,Math.pow(1 - (T + 273.15)/304.19,0.2903));
    }
}

function N2O_f(x, y) {
    return -y + 7251. * Math.exp((-6.71893 * (1 - x) + 1.35966 * Math.pow((1 - x),1.5) - 1.3779 * Math.pow((1 - x),2.5) - 4.051 * Math.pow((1 - x),5))/x);
}

function N2OPress(T) {
    if (T>=-90.0 && T<=-5.0)
        return N2O_f((T + 273.15)/309.57, 0)/100.;
    else
        return 'NaN';
}

function N2OTemp(p) {
    // -90 - -5 C
    return -273.15 + secant(N2O_f, 0.5916270956, 0.8662015053, 0.0000000001, p*100.)*309.57;
}

function N2ODs(p) {
    var T = N2OTemp(p);
    if (isNaN(T)) {
        return 0;
    } else {
        // Tr = T/Tc
        T = (T+273.15)/309.57;
        // rho_c*exp(A*pow(1 - T,1./3.) + B*pow(1 - T,2./3.) + C*(1 - T) + D*pow(1-T,4./3.))/1000.
        return 452.*Math.exp(1.72328*Math.pow(1 - T,1./3.) + -0.83950*Math.pow(1 - T,2./3.) + 0.51060*(1 - T) + -0.10412*Math.pow(1 - T,4./3.))/1000.;
    }
}

function GasDs(i) {
    switch (i) {
        case 1:
            return 1.4291;
            break;
        case 2:
            return 1.2506;
            break;
        case 3:
            return 1.7840;
            break;
        case 4:
            return 1.9772;
            break;
        case 5:
            return 1.9774;
            break;
        default:
            return 1;
    }
}

function LiqDs(i, p) {
    switch (i) {
        case 1:
            return O2Ds(p);
            break;
        case 2:
            return N2Ds(p);
            break;
        case 3:
            return ArDs(p);
            break;
        case 4:
            return CO2Ds(p);
            break;
        case 5:
            return N2ODs(p);
            break;
        default:
            return 0;
    }
}

function LiqTemp(i, p) {
    switch (i) {
        case 1:
            return O2Temp(p);
            break;
        case 2:
            return N2Temp(p);
            break;
        case 3:
            return ArTemp(p);
            break;
        case 4:
            return CO2Temp(p);
            break;
        case 5:
            return N2OTemp(p);
            break;
        default:
            return 0;
    }
}

function LiqPress(i, t) {
    switch (i) {
        case 1:
            return O2Press(t);
            break;
        case 2:
            return N2Press(t);
            break;
        case 3:
            return ArPress(t);
            break;
        case 4:
            return CO2Press(t);
            break;
        case 5:
            return N2OPress(t);
            break;
        default:
            return 0;
    }
}

function IsProbDs(i, p) {
    var tempVal;
    switch (i) {
        case 1:
            tempVal = O2Ds(p);
            break;
        case 2:
            tempVal = N2Ds(p);
            break;
        case 3:
            tempVal = ArDs(p);
            break;
        case 4:
            tempVal = CO2Ds(p);
            break;
        case 5:
            tempVal = N2ODs(p);
            break;
        default:
            return true;
    }

    if (IsProb(tempVal) || tempVal <= 0)
        return true;
}

function onDeviceReady() {
    init();
    if (!cordovaready) {
        document.getElementById("DDBSTLink").innerHTML = "<a target=\"_blank\" href=\"http://www.ddbst.com/calculation.html\">DDBST Online Calculation</a>";
        document.getElementById("NISTLink").innerHTML = "<a target=\"_blank\" href=\"https://webbook.nist.gov/\">NIST Chemistry WebBook</a>";
        document.getElementById("BNLLink").innerHTML = "<a target=\"_blank\" href=\"https://lar.bnl.gov/properties/basic.html\">LAr Basic Properties</a>";
        document.getElementById("BookLink").innerHTML = "<a target=\"_blank\" href=\"https://books.google.co.id/books?id=N8RcH8juG_YC&lpg=PP1&hl=id&pg=PA103#v=onepage&q&f=true\">Physical Properties of Liquids and Gases</a>";
        document.getElementById("EDGELink").innerHTML = "<a target=\"_blank\" href=\"http://edge.rit.edu/edge/P07106/public/Nox.pdf\">Thermophysical Properties of Nitrous Oxide</a>";
        document.getElementById("DonateLink").innerHTML = "Donation: <a target=\"_blank\" href=\"https://www.paypal.me/kumajaya\">via Paypal</a>";
        console.log('We on a ' + getBrowser() + ' browser...');
    }
    $('.splash').css('display', 'none');
}
