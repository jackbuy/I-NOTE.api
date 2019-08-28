
interface setArr {
    arr1: any;
    arr2: any;
    t: string;
    op1: string;
    op2: string;
}

class Utils {

    // 成功响应
    SuccessMsg = (res: any, { data, msg = 'ok', total }: any) => {
        const result: any = {
            code: 200,
            msg
        };
        if (data) result.data = data;
        if (total >= 0) result.total = total;
        return res.send(result)
    }

    // 异常响应
    ErrorMsg = (res: any, { code = 500, msg = 'error' }: any) => {
        return res.send({
            code,
            msg
        })
    }

    // 过滤数据
    setArr = ({ arr1, arr2, t, op1, op2 }: setArr) => {
        let _arr: any = [];
        arr1.map((item: any) => {
            arr2.map((item2: any) => {
                if (item[op1] == item2[op2]) item[t] = true;
            })
            _arr.push(item);
        })
        return _arr;
    }

}

export default new Utils();