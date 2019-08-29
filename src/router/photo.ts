// import Photo from '../model/photo';
// import Utils from '../utils/utils';
// const { SuccessMsg, ErrorMsg } = Utils;

// export const photoSave = (req: any, res: any) => {
//     const { userId } = req.UserMsg;
//     const { fromId, type, files } = req.body;
//     const data: any = {
//         userId,
//         img: files,
//         fromId,
//         type,
//         createTime: Date.now(),
//     }
//     Photo.save(data).then(() => {
//         SuccessMsg(res, {});
//     })
// }