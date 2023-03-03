// 使用严格模式 IE10前无法使用
"use strict";

// 立即执行函数
(() => {
    console.log("欢迎使用林风工具");
})()


// 设置默认值
const defaultConfig = {
    text: {
        judgeSpace: true,
    },
    date: {
        fmt: "YYYY-MM-DD hh:mm:ss",
        week: true,
    },
    animat: {
        floatText: [0, 1]
    }
}

/**
 * 判断数据类型
 * @param {*} param 需要判断数据类型的数据
 * @returns 以string形式返回判断结果
 */
function judgeDataType(param) {
    // 如果不是object类型的数据，直接用typeof就能判断出来
    // 弃用typeof，否则需要判断string和String两个比较麻烦
    // let type = typeof param;
    // if (type !== 'object') return type;
    // 如果是object类型数据，准确判断类型必须使用Object.prototype.toString.call(param)的方式才能判断
    const result = Object.prototype.toString.call(param).replace(/^\[object (\S+)\]$/, '$1');
    // Object.prototype.toString.call(Object.prototype)
    return result
}


/**
 * 根据指定格式进行格式化日期
 * Y年 M月 D日 h时 m分 s秒
 * @param {String} fmt 格式 默认为："YYYY-MM-DD hh:mm:ss"
 * @param {Date} date 日期对象
 * @param {Boolean} week true为天false为日，默认true
 * @returns 返回格式化完成的字符串
 */
function dateFormat(date, fmt, week = defaultConfig.date.week) {
    const dateType = judgeDataType(date)
    if (dateType != 'Date' && dateType != 'Undefind' && dateType != 'Null') throw new Error("异常数据类型，请传入合法数据\nError function:dateFormat()")
    if (judgeDataType(fmt) != 'String' || judgeNullValue(fmt)) {
        fmt = defaultConfig.date.fmt
    }
    let ret = "null";
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "M+": (date.getMonth() + 1).toString(),     // 月
        "D+": date.getDate().toString(),            // 日
        "h+": date.getHours().toString(),           // 时
        "m+": date.getMinutes().toString(),         // 分
        "s+": date.getSeconds().toString(),         // 秒
        "w+": date.getDay() ? date.getDay().toString() : "7", // 周
        "W+": date.getDay(),
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    switch (opt["W+"]) {
        case 0:
            if (week) opt["W+"] = "天";
            else opt["W+"] = "日"; break;
        case 1: opt["W+"] = "一"; break;
        case 2: opt["W+"] = "二"; break;
        case 3: opt["W+"] = "三"; break;
        case 4: opt["W+"] = "四"; break;
        case 5: opt["W+"] = "五"; break;
        case 6: opt["W+"] = "六"; break;
        default: opt["W=="] = "Error";
    }
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}


/**
 * 判断是否为空值
 * @param {*} param 需要判断的值
 * @param {Boolean} space 为是否去除空格，默认去除
 * @returns 若是空值返回true否则返回false
 * @returns 若为数值，0返回true，非0返回false
 */
function judgeNullValue(param, space = defaultConfig.text.judgeSpace) {
    const type = judgeDataType(param);
    if (type === "Undefined" || type === "Null") {
        return true
    } else if (type === "String") {
        if (space) {
            return param.trim().length ? false : true;
        } else {
            return param.length ? false : true;
        }
    } else if (type === "Number") {
        // 判断是否为0
        return (Number.parseFloat(param)) ? false : true;
    } else if (type === "Array") {
        // 判断是否为空数组
        return param.length ? false : true;
    } else if (type === "Object") {
        // 判断是否为空对象
        return JSON.stringify(param) === "{}"
    } else if (type === "Date") {
        // 判断日期是否为计算机默认起始日期
        return dateFormat(param) === "1970-01-01 00:00:00" ? true : false;
    } else {
        // 排除其余数据类型
        throw new Error("异常数据类型，请传入合法数据\nError function:judgeNullValue()")
    }
}


/**
 * 使用文字上浮消失效果
 * @param {*} textArr 
 * 传入的参数是你想要设定的参数
 * 若不设定会用默认值
 * 注意：该功能需要引入linfeng.css
 */
function linfengToolsAnimationFloatText(textArr = defaultConfig.animat.floatText) {
    if (judgeDataType(textArr) != "Array") throw new Error("您传递的数据不为数组\nError function:linfengToolsAnimationFloatText()")
    if (judgeNullValue(textArr)) throw new Error("数组不可为空\nError function:linfengToolsAnimationFloatText()")
    let getRandomColor = () =>
        "#" + (
            h => new Array(7 - h.length).join("0") + h
        )(
            (Math.random() * 0x1000000 << 0).toString(16)
        )

    let showText = textArr => {
        if (!textArr || textArr.length == 0) { return };
        let index = 0;
        document.documentElement.addEventListener("click", function (e) {
            let x = e.pageX;
            let y = e.pageY;
            //创建一个span
            let text = document.createElement("span");
            //给span添加了一个class
            text.setAttribute("class", "text_popup");
            //设置文本内容
            this.appendChild(text);
            if (textArr[index]) {
                text.innerHTML = textArr[index];
            } else {
                index = 0;
                text.innerHTML = textArr[index];
            }
            //给文本添加颜色
            text.style.color = getRandomColor();
            text.addEventListener("animationend", function () {
                text.parentNode.removeChild(text);
            }, false)
            if (x < text.clientWidth) {
                text.style.left = x + "px";
            } else if (text.clientWidth > (document.documentElement.clientWidth - x)) {
                text.style.left = (x - text.clientWidth) + "px";
            } else {
                text.style.left = (x - text.clientWidth / 2) + "px";
            }

            text.style.top = (y - text.clientHeight / 2) + "px";
            index++;
        }, false)
    }

    showText(textArr)
}



const linfeng = {
    type: judgeDataType,
    date: dateFormat,
    null: judgeNullValue,
    text: {

    },
    // 动画
    animat: {
        floatText: linfengToolsAnimationFloatText,
    }
}
