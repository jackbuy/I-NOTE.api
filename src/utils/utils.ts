export const ErrorMsg = ( res: any, { msg = 'error' }: any ) => {
    return res.send({
        code: 500,
        msg
    })
}

export const SuccessMsg = ( res: any, { data, msg = 'ok', total }: any ) => {
    const result: any = {
        code: 200,
        msg
    };
    if (data) result.data = data;
    if (total >= 0) result.total = total;
    return res.send(result)
}