// 过滤数据
interface setArr {
    arr1: any;
    arr2: any;
    t: string;
    op1: string;
    op2: string;
}
export const setArr = ({ arr1, arr2, t, op1, op2 }: setArr) => {
    let _arr: any = [];
    arr1.map((item: any) => {
        arr2.map((item2: any) => {
            if (item[op1] == item2[op2]) item[t] = true;
        })
        _arr.push(item);
    })
    return _arr;
}

// 异常响应
export const ErrorMsg = (res: any, { msg = 'error' }: any) => {
    return res.send({
        code: 500,
        msg
    })
}

// 成功响应
export const SuccessMsg = (res: any, { data, msg = 'ok', total }: any) => {
    const result: any = {
        code: 200,
        msg
    };
    if (data) result.data = data;
    if (total >= 0) result.total = total;
    return res.send(result)
}
