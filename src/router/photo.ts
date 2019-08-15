import Photo from '../model/photo';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

export const photoSave = (req: any, res: any) => {
    const { userId } = req.UserMsg;
    const { fromId, type, files } = req.body;
    const data: any = {
        userId,
        img: files,
        fromId,
        type,
        createTime: Date.now(),
    }
    Photo.save(data).then(() => {
        SuccessMsg(res, {});
    })
}