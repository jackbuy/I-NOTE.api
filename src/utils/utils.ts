export const ErrorMsg = ( res: any, { msg = 'error' }: any ) => {
    return res.send({
        code: 401,
        msg
    })
}

export const SuccessMsg = ( res: any, { data, msg = 'ok', total }: any ) => {
    const result: any = {
        code: 200,
        msg
    };
    if (data) result.data = data;
    if (total) result.total = total;
    return res.send(result)
}