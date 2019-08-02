// 检查ID是否存在
export const checkHasId = (res: any, Schema: any, id: string) => {
    return new Promise((resolve, reject) => {
        Schema.findOne({ _id: id }).then((resp: any) => {
            if (resp) {
                resolve()
            } else {
                ErrorMsg(res, { msg: 'id不存在！' });
            };
        }).catch(() => {
            ErrorMsg(res, { msg: 'id错误！' });
        });
    });
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
