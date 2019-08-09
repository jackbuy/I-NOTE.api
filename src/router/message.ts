import Message from '../model/message';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

export const messageQuery = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { currentPage = 1, pageSize = 10 } = req.body;
    const query = { receiveUserId: userId };
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    Message.queryLimit({ query, querySkip, querylimit }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    });
}