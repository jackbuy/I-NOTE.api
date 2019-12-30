
class Utils {

    // 成功响应
    SuccessMsg = (res: any, { data, msg = 'ok', total }: any) => {
        const result: any = {
            code: 200,
            msg
        };
        if (data) result.data = data;
        if (total >= 0) result.total = total;
        return res.json(result)
    }

    // 异常响应
    ErrorMsg = (res: any, { code = 500, msg = '' }: any) => {
        return res.json({
            code,
            msg
        })
    }

}

export default new Utils();